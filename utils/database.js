const Sequelize = require('sequelize');
const sequelize = new Sequelize('chat', 'root', 'Anurag@9839', {
    host: 'localhost',
    dialect: 'mysql'
});
module.exports = sequelize;