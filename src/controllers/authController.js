// controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            password,
        });

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            message: "Регистрация прошла успешно",
            token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Ошибка сервера: ${err.message}` });
    }
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        // Проверяем правильность пароля
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.json({
            message: "Вход выполнен успешно",
            token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Ошибка сервера: ${err.message}` });
    }
};

module.exports = { registerUser, loginUser };
