const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "1234", {
    host:"localhost",
    dialect:"mysql",
    port: 3307 
})

module.exports = connection