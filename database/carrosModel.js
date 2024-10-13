const sequelize = require('sequelize')
const connection = require('./database')
const usuario = require('./usuarioModel')

const carros = connection.define('carros', {
    placa: {
        type: sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
    },
    modelo:{
        type: sequelize.STRING(100),
        allowNull: false,
    },
    usuarioEmail:{
        type: sequelize.STRING(100),
        allowNull: false,
    }

})

carros.belongsTo(usuario, {
    foreignKey: 'usuarioEmail',
    targetKey: 'email',
    onDelete: 'CASCADE'
})

module.exports = carros