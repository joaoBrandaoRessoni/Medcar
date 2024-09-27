const sequelize = require("sequelize")
const connection = require("./database")

const usuario = connection.define('usuario', {
    idUsuario:{},
    
    email:{
        type: sequelize.STRING(100),
    }
})