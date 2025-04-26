const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const {logger} = require("sequelize/lib/utils/logger");

const openai = require('../config/openaiClient');
const WorkExperience = require("../models/WorkExperience");

// Create Job
const createJob = async (req, res) => {
    try {
        const job = await Job.create({...req.body, userId: req.user.id});
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({message: `Ошибка при создании: ${err.message}`});
    }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({order: [['createdAt', 'DESC']]});
        res.json(jobs);
    } catch (err) {
        res.status(500).json({message: 'Ошибка при получении вакансий'});
    }
};

// Get single job
const getJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({message: 'Вакансия не найдена'});
        res.json(job);
    } catch (err) {
        res.status(500).json({message: 'Ошибка при получении вакансии'});
    }
};

const searchJobsText = async (req, res) => {
    const {query} = req.query;
    console.log("search")
    try {
        // Если нет запроса — вернём первые 12 вакансий
        if (!query || query.trim() === "") {
            const jobs = await Job.findAll({
                order: [['createdAt', 'DESC']],
                limit: 12,
            });
            return res.json(jobs);
        }

        const words = query.toLowerCase().split(/\s+/);
        const allJobs = await Job.findAll();

        const filtered = allJobs.filter(job => {
            const text = `${job.title} ${job.description} ${job.requirements} ${job.schedule} ${job.company_name}`.toLowerCase();
            return words.some(word => text.includes(word));
        });

        res.json(filtered);
    } catch (err) {
        console.error("Ошибка при поиске:", err); // лог в терминал
        res.status(500).json({message: `Ошибка при поиске: ${err.message}`});
    }
};

const getApplicantsForJob = async (req, res) => {
    const jobId = req.params.jobId; // Получаем ID вакансии

    try {
        // Находим отклики для указанной вакансии
        const applications = await Application.findAll({
            where: {jobId}, // Ищем отклики для этой вакансии
            include: [{
                model: User,
                attributes: ['id', 'first_name', 'last_name', 'email'], // Добавляем информацию о пользователе
            }],
        });

        // Возвращаем информацию об откликнувшихся пользователях
        const applicants = applications.map(application => application.User);
        res.json(applicants);
    } catch (err) {
        res.status(500).json({message: `Ошибка при получении откликов: ${err.message}`});
    }
};


const getJobsWithApplications = async (req, res) => {
    const userId = req.user.id; // Получаем ID авторизованного пользователя

    try {
        // Находим вакансии, на которые откликнулся пользователь
        const applications = await Application.findAll({
            where: {userId}, // Ищем все отклики текущего пользователя
        });

        // Получаем только те вакансии, на которые был отклик
        const jobIds = applications.map((application) => application.jobId);

        const jobs = await Job.findAll({
            where: {id: jobIds}, // Ищем только те вакансии, которые есть в откликах
            order: [['createdAt', 'DESC']], // Сортируем по дате создания
        });

        // Добавляем поле isApplied для каждой вакансии (оно всегда будет true)
        const jobsWithApplications = jobs.map((job) => {
            job.isApplied = true; // Пользователь подался на эту вакансию
            return job;
        });

        res.json(jobsWithApplications);
    } catch (err) {
        res.status(500).json({message: `Ошибка при получении вакансий: ${err.message}`});
    }
};


const getUserJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: {userId: req.user.id}, // Ищем вакансии, принадлежащие текущему пользователю
            order: [['createdAt', 'DESC']], // Сортируем по дате создания
        });

        res.json(jobs);
    } catch (err) {
        res.status(500).json({message: `Ошибка при получении вакансий: ${err.message}`});
    }
};

// Update job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.userId !== req.user.id)
            return res.status(403).json({message: 'Нет доступа'});

        await job.update(req.body);
        res.json({message: 'Вакансия обновлена', job});
    } catch (err) {
        res.status(500).json({message: 'Ошибка при обновлении'});
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.userId !== req.user.id)
            return res.status(403).json({message: 'Нет доступа'});

        await job.destroy();
        res.json({message: 'Вакансия удалена'});
    } catch (err) {
        res.status(500).json({message: `Ошибка при удалении ${err.message}`});
    }
};

const getJobRecommendations = async (req, res) => {
    console.log(res.user)
    try {
        const user = await User.findByPk(req.user.id, {
            include: [WorkExperience],
        });
        const jobs = await Job.findAll();

        const prompts = [
            {
                role: 'user',
                content: `
                User INFO: "User name: ${user.first_name} ${user.last_name}, skills: ${user.skills} \n "
                User work expirience: ${user.WorkExperiences.map((work) => {
                    `
                ${work.position} ${work.description} \n`
                })}
                
                JOBS: ${
                    jobs.map((job) => {
                        return `ID: ${job.id} title: ${job.title}, salary: ${job.company_name}, requirements: ${job.requirements}, description: ${job.description} \n`
                    })
                }   
                
                return ONLY an array of ids of MAX 10 jobs that are great jobs for users
            `
            }]
        console.log(prompts)
        //
        // // Send batch request to OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: prompts,
        });
        console.log("responses: ", response)
        // // Process the responses

        const jobIds = JSON.parse(response.choices[0].message.content.trim());
        // Sort jobs by match score and return top 5
        // jobMatches.sort((a, b) => b.matchScore - a.matchScore);

        const ai_jobs = await Promise.all(
            jobIds.map(async (jobId) => {
                const temp = await Job.findByPk(jobId);
                console.log(temp);  // This will log the resolved values
                return temp;
            })
        );
        res.json({
            jobs: ai_jobs,
            response: response,
            job_ids: jobIds
        });
    } catch (err) {
        console.error('Error getting job recommendations:', err);
        res.status(500).json({message: `Error: ${err.message}`});
    }
};

const getAdvicesForJob = async (req, res) => {
    const jobId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id, {
            include: [WorkExperience],
        });
        const job = await Job.findByPk(jobId);

        if (!job) {
            return res.status(404).json({message: 'Вакансия не найдена'});
        }

        const prompt = [
            {
                role: 'user',
                content: `
User Profile:
Name: ${user.first_name} ${user.last_name}
Skills: ${user.skills || 'No skills provided'}
Work Experience: ${
                    user.WorkExperiences.length > 0
                        ? user.WorkExperiences.map((work) => `${work.position}: ${work.description}`).join('\n')
                        : 'No work experience provided'
                }

Job Details:
Title: ${job.title}
Company: ${job.company_name}
Requirements: ${job.requirements}
Description: ${job.description}

Task:
Analyze the user's profile and the job's requirements.
List what technologies, tools, or concepts the user should learn to have a better chance of getting this job.
Return a bullet point list of technologies or concepts to learn.
return an an odject with list of objects with advises like in example: {
    ready: "none",
    advises: [
        text: "[advise text]",
        link: "[link to source]"
    ]
}
If the user is already strong enough, return object {ready: "No additional technologies needed, ready to apply."}
                `
            }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: prompt,
        });

        const advises = JSON.parse(response.choices[0].message.content.trim());

        res.json({
            job,
            ...advises,
        });

    } catch (err) {
        console.error('Error getting advises for job:', err);
        res.status(500).json({message: `Ошибка при получении советов: ${err.message}`});
    }
};


module.exports = {
    createJob,
    getAllJobs,
    getUserJobs,
    getJob,
    searchJobsText,
    getApplicantsForJob,
    getJobsWithApplications,
    updateJob,
    deleteJob,
    getJobRecommendations,
    getAdvicesForJob
};
