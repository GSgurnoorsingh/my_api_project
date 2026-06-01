const sequelize = require('../config/db');
const User = require('./User');
const Task = require('./Task');

User.hasMany(Task,{ foreignKey: 'userId',onDelete: 'CASCADE'});
Task.belongsTo(User,{foreignKey: 'userId'});

module.exports={
    sequelize,
    User,
    Task
};