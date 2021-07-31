const Sequelize = require("sequelize");
const connection = new Sequelize("guiaperguntas", "root","KMario23",{
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;