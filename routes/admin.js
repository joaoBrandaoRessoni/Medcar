const express = require("express")
const adminRouter = express.Router()
const usuarioModel = require("../database/usuarioModel")
const permissoesModel = require("../database/usuarioModel")
const jwt = require('jsonwebtoken')

adminRouter.get("/gerenciamento", (req,res) => {
    usuarioModel.findAll().then((users) => {
        res.render("gerenciamento", {users})
    })
})

adminRouter.get("/gerenciamento/confirmarAdmin", (req,res) => {
    res.render("confirmarAdmin")
})

adminRouter.get("/gerenciamento/createTypePermission", (req,res) => {
    console.log(req.query.senha);
    if(req.query.senha == process.env.ADMIN_PASSWORD){
        res.render("createTypePermission")
    }
})



module.exports = adminRouter