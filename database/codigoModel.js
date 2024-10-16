const sequelize = require('sequelize')
const connection = require('./database')
const usuario = require('./usuarioModel')

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

codigo.belongsTo(usuario, {
    foreignKey: 'usuarioEmail',
    targetKey: 'email',
    onDelete: 'CASCADE'
})

module.exports = codigo