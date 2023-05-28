const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Groups = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING
});
module.exports = Groups;