const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "1234", {
    host:"localhost",
    dialect:"mysql"
})

module.exports = connection