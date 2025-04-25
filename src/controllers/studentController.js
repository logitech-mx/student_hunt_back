// controllers/studentController.js
const User = require('../models/User');
const WorkExperience = require("../models/WorkExperience");

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

module.exports = { getStudentById, searchStudents };
