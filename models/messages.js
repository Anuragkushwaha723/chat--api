const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Messages = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    messages: Sequelize.STRING
});
module.exports = Messages;