// models/Application.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Job = require('./Job');
const User = require('./User');

const Application = sequelize.define('Application', {
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
});

// связь с Job и User
Job.hasMany(Application, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

User.hasMany(Application, { foreignKey: 'userId', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'userId' });

module.exports = Application;
