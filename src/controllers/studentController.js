// controllers/studentController.js
const User = require('../models/User');
const Job = require('../models/Job');
const WorkExperience = require("../models/WorkExperience");
const openai = require('../config/openaiClient');

const searchStudents = async (req, res) => {
    const { query } = req.query;

    try {
        const baseWhere = { is_active_resume: true };
        const users = await User.findAll({ where: baseWhere });

        if (!query || query.trim() === '') {
            // Вернуть первые 12
            return res.json(users.slice(0, 12));
        }

        const words = query.toLowerCase().split(/\s+/);
        const filtered = users.filter(user => {
            const text = `${user.first_name} ${user.last_name} ${user.description} ${user.skills} ${user.available_time}`.toLowerCase();
            return words.some(word => text.includes(word));
        });

        res.json(filtered);
    } catch (err) {
        console.error("Ошибка при поиске студентов:", err);
        console.log(process.env.PGDATABASE, process.env.PGUSER, process.env.PGHOST, process.env.PGHOST)
        res.status(500).json({ message: `Ошибка при поиске студентов: ${err.message}` });
    }
};

const getStudentById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [WorkExperience],
        });

        if (!user || !user.is_active_resume) {
            return res.status(404).json({ message: "Студент не найден" });
        }

        res.json(user);
    } catch (err) {
        console.error("Ошибка при получении студента:", err);
        res.status(500).json({ message: `Ошибка при получении студента: ${err.message}` });
    }
};

const getStudentsForJob = async (req, res) => {
    try {
        // Fetch the job details
        console.log(req.user.id)
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user)
        // Fetch all jobs for the user
        const jobs = await Job.findAll({
            where: { userId: user.id }, // Fetch jobs belonging to the logged-in user
        });
        console.log(jobs)
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this user' });
        }
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        console.log(job)
        // Fetch all active students
        const students = await User.findAll({
            where: { is_active_resume: true },
            include: [WorkExperience],
        });

        // Prepare the prompt for OpenAI
        const prompt = {
            role: 'user',
            content: `
                JOB: title: ${job.title}, salary: ${job.salary}, requirements: ${job.requirements}, description: ${job.description}
                STUDENTS: ${students.map(student => `
                    ID: ${student.id}, name: ${student.first_name} ${student.last_name}, skills: ${student.skills}, experience: ${student.WorkExperiences.map(work => work.position).join(', ')}
                `).join('')}
                Return ONLY an array of student IDs, MAX 10. who are most suitable for this job, based on their skills and experience.
            `,
        };
        console.log(prompt)

        // Send the request to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [prompt],
        });
        console.log(response)

        // Parse the response to extract student IDs
        const studentIds = JSON.parse(response.choices[0].message.content.trim());

        // Retrieve the student records
        const matchedStudents = await Promise.all(
            studentIds.map(async (studentId) => {
                const temp = await User.findByPk(studentId);
                console.log(temp);  // This will log the resolved values
                return temp;
            })
        );

        res.json({
            students: matchedStudents,
            job: job,
            response: response
        })
    } catch (err) {
        console.error('Error fetching students for job:', err);
        res.status(500).json({ message: `Error: ${err.message}` });
    }
};


module.exports = { getStudentById, searchStudents, getStudentsForJob };
