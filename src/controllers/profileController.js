// controllers/profileController.js
const User = require('../models/User');
const WorkExperience = require('../models/WorkExperience');

// Get user profile
const getProfile = async (req, res) => {

    try {
        const user = await User.findByPk(req.user.id, {
            include: [WorkExperience],
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: `Ошибка сервера ${err.message}` });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        await User.update(req.body, {
            where: { id: req.user.id },
        });
        res.json({ message: 'Профиль обновлён' });
    } catch (err) {
        res.status(500).json({ message: `Ошибка сервера: ${err.message}` });
    }
};

// Add experience
const addExperience = async (req, res) => {
    try {
        const experience = await WorkExperience.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json(experience);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при добавлении опыта' });
    }
};

// Update experience
const updateExperience = async (req, res) => {
    try {
        await WorkExperience.update(req.body, {
            where: { id: req.params.id, userId: req.user.id },
        });
        res.json({ message: 'Опыт обновлён' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при обновлении опыта' });
    }
};

// Delete experience
const deleteExperience = async (req, res) => {
    try {
        await WorkExperience.destroy({
            where: { id: req.params.id, userId: req.user.id },
        });
        res.json({ message: 'Опыт удалён' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при удалении опыта' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
};
