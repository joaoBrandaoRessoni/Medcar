const usuario = require('./usuarioModel')
const carros = require('./carrosModel')
const codigo = require('./codigoModel')
const servicos = require('./servicosModel')
const sequelize = require('./database')

async function syncAll(){
    await sequelize.sync({force: false})

    await usuario.sync({force: false})
    
    await carros.sync({force: false})
    
    await servicos.sync({force: false})
    
    await codigo.sync({force: false})

}

syncAll();
