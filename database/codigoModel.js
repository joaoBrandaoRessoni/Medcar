const sequelize = require('sequelize')
const connection = require('./database')

const codigo = connection.define('codigo', {
    cod:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    usuarioEmail:{
        type: sequelize.STRING(100),
        allowNull: false,
    }
})

codigo.sync({force: false}).then(()=> {
    console.log("Tabela de codigos criada!")
})

module.exports = codigo