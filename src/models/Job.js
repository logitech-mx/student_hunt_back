const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Job = sequelize.define('Job', {
    title: { type: DataTypes.STRING, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.FLOAT, allowNull: false },
    schedule: { type: DataTypes.STRING, allowNull: false },
    working_hours: { type: DataTypes.STRING, allowNull: false },
    deadline: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    requirements: { type: DataTypes.TEXT, allowNull: false },
});

// связь с User
User.hasMany(Job, { foreignKey: 'userId', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'userId' });

module.exports = Job;
