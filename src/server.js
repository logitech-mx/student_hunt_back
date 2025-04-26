// server.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');

const User = require('./models/User');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const studentRoutes = require('./routes/students');
const applicationRoutes = require('./routes/applicationRoutes');  // Подключаем маршруты откликов

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
console.log("Trying to connect database")
sequelize.sync({ alter: true })
    .then(() => console.log("Database connected and models synchronized."))
    .catch((err) => console.log("DB connection error:", err));

// Регистрация
app.post("/api/auth/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: "Пользователь уже существует" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ first_name, last_name, email, password: hashedPassword });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ message: "Регистрация успешна", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Логин
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({ message: "Успешный вход", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// 👇 Подключаем защищённые маршруты профиля
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);  // Добавляем маршруты откликов

// Запуск
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
