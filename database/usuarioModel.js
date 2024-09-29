const sequelize = require('sequelize')
const connection = require('./database')

const usuario = connection.define('usuario', {
    email:{
        type: sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: sequelize.STRING(100),
        allowNull: false
    },
    celular:{
        type: sequelize.STRING(12),
        allowNull: true
    },
    cpf:{
        type: sequelize.STRING(14),
        allowNull: true
    },
    senha:{
        type: sequelize.STRING,
        allowNull: false
    }
})

usuario.sync({force: false}).then(()=> {
    console.log("Tabela de usuarios criada!")
})

module.exports = usuario