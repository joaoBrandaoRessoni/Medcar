const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "1234", {
    host:"localhost",
    dialect:"mysql",
    port: 3306,
    timezone: "-03:00"
}

)


module.exports = connection