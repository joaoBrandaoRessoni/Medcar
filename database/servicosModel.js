const sequelize = require('sequelize')
const connection = require('./database')
const carros = require('./carrosModel')
const usuario = require('./usuarioModel')

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
    },
    dataSaida:{
        type: sequelize.DATEONLY,
        allowNull: true
    }
})


servicos.belongsTo(carros, {
    foreignKey: 'placaCarro',
    targetKey: 'placa',
    onDelete: 'CASCADE'
})

servicos.belongsTo(usuario, {
    foreignKey: 'usuarioEmail',
    targetKey: 'email',
    onDelete: 'CASCADE'
})

module.exports = servicos