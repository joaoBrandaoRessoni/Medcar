const usuario = require('./usuarioModel')
const carros = require('./carrosModel')
const codigo = require('./codigoModel')
const servicos = require('./servicosModel')
const permissoes = require('./permissoesModel')
const sequelize = require('./database')

async function syncAll(){
    await sequelize.sync({force: false})

    await usuario.sync({force: false}).then(()=> {
        console.log("Tabela de usuarios criada!")
    })
    
    await carros.sync({force: false}).then(()=> {
        console.log("Tabela de carros criada!")
    })
    
    await servicos.sync({force: false}).then(()=> {
        console.log("Tabela de Serviços criada!")
    })
    
    await codigo.sync({force: false}).then(()=> {
        console.log("Tabela de codigos criada!")
    })
    
}

syncAll();
