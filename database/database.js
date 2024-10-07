const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "", {
    host:"localhost",
    dialect:"mysql"
})

module.exports = connection