const sequelize = require('sequelize')
const connection = require('./database')
const pergunta = require('./perguntaModel')
const usuario = require('./usuarioModel')

const resposta = connection.define('resposta', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pergunta_id:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    emailUsuario: {
        type: sequelize.STRING(100),
        allowNull: false,
    },
    resposta: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

resposta.belongsTo(usuario, {
    foreignKey: 'emailUsuario',
    targetKey: 'email',
})

module.exports = resposta