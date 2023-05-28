const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const UserGroup = sequelize.define('usergroups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    admin: Sequelize.BOOLEAN
});
module.exports = UserGroup;