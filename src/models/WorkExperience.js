// models/WorkExperience.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const WorkExperience = sequelize.define('WorkExperience', {
    position: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE },
    company_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
});

// Связь: один пользователь — много опыта
User.hasMany(WorkExperience, { foreignKey: 'userId', onDelete: 'CASCADE' });
WorkExperience.belongsTo(User, { foreignKey: 'userId' });

module.exports = WorkExperience;
