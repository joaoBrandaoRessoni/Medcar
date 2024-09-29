const express = require("express")
const usuarioRouter = express.Router()
const usuarioModel = require("../database/usuarioModel")

usuarioRouter.post("/createUser", (req,res)=>{
    let email = req.body.email
    let senha = req.body.senha
    let nome = req.body.nome
    let cpf = req.body.cpf ?? null
    let celular = req.body.celular ?? null

    usuarioModel.create({
        email: email,
        senha: senha,
        nome: nome,
        cpf:cpf,
        celular:celular
    }).then(() => {
        res.send("Usuario criado")
    }).catch((erro) => {
        res.send("Usuário já existe <br />" + erro)
    })
})

usuarioRouter.post("/updateUser", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha ?? null
    let nome = req.body.nome ?? null
    let cpf = req.body.cpf ?? null
    let celular = req.body.celular ?? null

    usuarioModel.update({
        senha: senha,
        nome: nome,
        cpf:cpf,
        celular:celular
    }, {where: {email: email}}).then(() => {
        return res.redirect("/")
    }).catch((erro) => {
        res.sendStatus(500)
    })
})

usuarioRouter.post("/login", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha

    usuarioModel.findOne({
        where:{email: email, senha: senha}
    }).then((usuarioModel)=>{
        if(email && senha){
            res.render("/home")
        }else if(email == '' || senha == '' ) {
            res.redirect("/")
        }
    }).catch((erro) => {
        res.redirect("/")
    })
})

usuarioRouter.get("/register", (req, res) => {
    res.render("index")
})

usuarioRouter.get("/login", (req, res) => {
    res.redirect("login")
})

usuarioRouter.get("/", (req, res) => {
    res.redirect("home")
})

module.exports = usuarioRouter