const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "", {
    host:"localhost",
    dialect:"mysql",
    port: 3306
})

module.exports = connection