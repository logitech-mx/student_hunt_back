require('dotenv').config(); // Load environment variables from the .env file
const { Sequelize } = require('sequelize');

// Create a Sequelize instance using values from .env
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name from .env
    process.env.DB_USER, // Database username from .env
    process.env.DB_PASSWORD, // Database password from .env
    {
        host: process.env.DB_HOST, // Host from .env
        dialect: 'postgres', // Database dialect
        logging: false, // Disable SQL query logging
    }
);

module.exports = sequelize;
