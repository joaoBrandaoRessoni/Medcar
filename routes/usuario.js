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
        const usuario = {
            email: email,
            nome: nome,
            senha: senha,
            exp: Date.now() + 60000,
        }
        const token = jwt.sign(usuario, process.env.SECRET_KEY)
        res.cookie("medcar_token", token, {
            httpOnly: true,
        })
        res.redirect("/")
    }).catch((erro) => {
        if(erro.errors.ValidationErrorItem.type == "unique violation"){
            res.redirect("/register/Email já cadastrado")
        }else{
            res.redirect("/register/Não foi possível fazer o cadastro")
        }
        
    })
})

usuarioRouter.post("/updateUser", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha

    usuarioModel.update({
        senha: senha,
    }, {where: {email: email}}).then((num) => {
        if(num == 0){
            return res.redirect("/forgetPassword/Usuario não encontrado")
        }else{
            return res.redirect("/allUsers")
        }
    }).catch((erro) => {
        return res.redirect("/forgetPassword/Não foi possível atualizar")
    })
})

usuarioRouter.post("/login", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha

    const jwt = require("jsonwebtoken")

    usuarioModel.findOne({
        where:{email: email, senha: senha}
    }).then((user)=>{
        if(user){
            const usuario = {
                email: user.email,
                nome: user.nome,
                senha: user.senha,
                exp: Date.now() + 60000,
            }
            const token = jwt.sign(usuario, process.env.SECRET_KEY)
            res.cookie("medcar_token", token, {
                httpOnly: true,
            })
            res.redirect("/status")
        }else {
            res.redirect("login/Usuario não encontrado")
        }
    }).catch((erro) => {
        res.redirect("/")
    })
})

usuarioRouter.get("/status", (req,res) => {
    res.render("status")
})

usuarioRouter.get("/deleteUser/:email", (req,res) => {
    let email = req.params.email
    usuarioModel.destroy({
        where: {email:email}
    }).then(() => {
        res.redirect("/allUsers")
    }).catch(() => {
        res.redirect("/allUsers")
    })
})

usuarioRouter.get("/forgetPassword/:msg?", (req,res) => {
    let msg = req.params.msg ?? null
    res.render("changePassword", {msg})
})

module.exports = usuarioRouter