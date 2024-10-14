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

servicos.belongsTo(carros, {
    foreignKey: 'placaCarro',
    targetKey: 'placa',
    onDelete: 'CASCADE'
})

carros.sync({force: false}).then(()=> {
    console.log("Tabela de carros criada!")
})

module.exports = carros