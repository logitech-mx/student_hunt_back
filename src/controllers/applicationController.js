// controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');

// Создание отклика
const createApplication = async (req, res) => {
    const { jobId, message } = req.body;
    const userId = req.user.id;

    try {
        // Проверка, что вакансия существует
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Проверка, откликался ли пользователь на эту вакансию
        const existingApplication = await Application.findOne({
            where: { jobId, userId }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Вы уже откликнулись на эту вакансию.' });
        }

        // Создание нового отклика
        const application = await Application.create({
            jobId,
            userId,
            message,
        });

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: `Ошибка при создании отклика: ${err.message}` });
    }
};

// Получение информации о том, подался ли пользователь на вакансию
const checkApplicationStatus = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    try {
        const application = await Application.findOne({ where: { jobId, userId } });

        if (application) {
            return res.json({ applied: true, application });
        } else {
            return res.json({ applied: false });
        }
    } catch (err) {
        res.status(500).json({ message: `Ошибка при проверке статуса отклика: ${err.message}` });
    }
};

module.exports = { createApplication, checkApplicationStatus };
