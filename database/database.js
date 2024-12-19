const sequelize = require("sequelize")

const connection = new sequelize("medcar", "root", "", {
    host:"186.219.147.57",
    dialect:"mysql",
    port: 3306,
    timezone: "-03:00"
}

)


module.exports = connection