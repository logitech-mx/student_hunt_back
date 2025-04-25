require('dotenv').config(); // Load environment variables from the .env file
const { Sequelize } = require('sequelize');

// Create a Sequelize instance using the Railway-provided environment variables
const sequelize = new Sequelize(
    process.env.PGDATABASE,  // Database name from Railway
    process.env.PGUSER,      // Database username from Railway
    process.env.PGPASSWORD,  // Database password from Railway
    {
        host: process.env.PGHOST,   // Host from Railway
        port: process.env.PGPORT,   // Port from Railway (default is 5432 for PostgreSQL)
        dialect: 'postgres',        // Database dialect
        logging: false,             // Disable SQL query logging
    }
);

module.exports = sequelize;
