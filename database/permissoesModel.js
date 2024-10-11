const sequelize = require('sequelize')
const connection = require('./database')
const usuarioModel = require("./usuarioModel")

const permissoes = connection.define('permissoes', {
    id:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    rota:{
        type: sequelize.STRING(100),
        allowNull: false
    },
    emailUsuario: {
        type: sequelize.STRING(100),
        allowNull: false
    }
})

usuarioModel.hasMany(permissoes, {
    foreignKey: {
        name: 'emailUsuario'
    },
    onDelete: 'CASCADE'
})

permissoes.sync({force: false}).then(()=> {
    console.log("Tabela de permissoes criada!")
})

module.exports = permissoes