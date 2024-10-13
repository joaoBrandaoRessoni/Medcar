const sequelize = require('sequelize')
const connection = require('./database')

const servicos = connection.define('servicos', {
    idServicos:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    placaCarro: {
        type: sequelize.STRING(20),
        allowNull: false
    },
    usuarioEmail:{
        type: sequelize.STRING(100),
        allowNull: false
    },
    descricao:{
        type: sequelize.TEXT,
        allowNull: false
    }
})

servicos.sync({force: false}).then(()=> {
    console.log("Tabela de Serviços criada!")
})

module.exports = servicos