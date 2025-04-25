// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'job_platform', // имя базы данных
    'user', // имя пользователя
    'password123', // пароль
    {
        host: 'localhost', // или 'postgres_container', если подключение через Docker
        dialect: 'postgres',
        logging: false, // отключить логирование SQL запросов
    }
);

module.exports = sequelize;
