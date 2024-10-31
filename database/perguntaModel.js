const sequelize = require('sequelize')
const connection = require('./database')
const usuario = require('./usuarioModel')

const pergunta = connection.define('pergunta', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    emailUsuario: {
        type: sequelize.STRING(100),
        allowNull: false,
    },
    titulo:{
        type: sequelize.STRING(100),
        allowNull: false,
    },
    pergunta:{
        type: sequelize.TEXT,
        allowNull: false,
    },
})

pergunta.belongsTo(usuario, {
    foreignKey: 'emailUsuario',
    targetKey: 'email',
})

module.exports = pergunta