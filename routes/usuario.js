const express = require("express")
const usuarioRouter = express.Router()
const usuarioModel = require("../database/usuarioModel")
const codigoModel = require("../database/codigoModel")
const nodemailer = require("nodemailer")
const servicosModel =  require("../database/servicosModel")
const jwt = require('jsonwebtoken')
const { where } = require("sequelize")

usuarioRouter.post("/createUser", (req,res)=>{
    let email = req.body.email
    let senha = req.body.senha
    let nome = req.body.nome
    let cpf = req.body.cpf ?? null
    let celular = req.body.celular ?? null

    usuarioModel.findOne({where: {email: email}})
        .then((user) => {
            if(user != null){
                res.redirect("/register/Email já cadastrado")
            }
        })

    usuarioModel.create({
        email: email,
        senha: senha,
        nome: nome,
        cpf:cpf,
        celular:celular,
        tipo_permissao: "user"
    }).then(() => {
        usuario = null;
        let usuario = {
            email: email,
            nome: nome,
            senha: senha,
            permissao: "user",
            exp: Date.now() + ((60000 * 60) * 8),
        }
        const token = jwt.sign(usuario, process.env.SECRET_KEY)
        res.cookie("medcar_token", token, {
            httpOnly: true,
        })
        res.redirect("/status")
    }).catch((erro) => {
        if(erro.errors[0].type){
            if(erro.errors[0].type == "unique violation"){
                res.redirect("/register/Email já cadastrado")
            }else{
                res.redirect("/register/Não foi possível completar o cadastro")
            }
            
        }else{
            res.redirect("/register/Não foi possível fazer o cadastro")
        }
    })
})

usuarioRouter.post("/validarEmail", (req,res) => {
    let email = req.body.email

    // Gera um código aleatório
    let codigo = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000

    usuarioModel.findOne({
        where:{email: email}
    }).then((user)=>{
        if(!user){
            return res.render("validarEmail", {msg: "Email não cadastrado"})
        }

        // Insere os dados na tabela codigos, para linkar o usuario no codigo e facilitar na validação
        codigoModel.findOne({
            where:{usuarioEmail: email}
        }).then((user)=>{
            if(!user){
                codigoModel.create({
                    usuarioEmail: email,
                    cod: codigo
                })
            }else{
                codigoModel.update(
                    { cod: codigo },
                    { where: { usuarioEmail: email } }
                )
            }
        })


        // Configuração do Nodemailer
        const remetente = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:{
                user: 'igor.pirola@sou.fae.br',
                pass: 'vklswiwxmzjhhnug',
            }
        })

        // Configuração do e-mail a ser enviado
        const emailASerEnviado = {
            from: 'Medcar <igor.pirola@sou.fae.br>',
            to: email, 
            subject: 'Código para reset de senha',
            html: `<h1>Seu código de verificação é</h1> <h2 style="text-align: center;">${codigo}</h2>`,
        }

        //Envia o e-mail
        remetente.sendMail(emailASerEnviado, (error) => {
            if (error) {
                res.render("validarEmail", {msg: "Erro ao enviar o email, tente novamente mais tarde"})
            }
            res.render("validarCodigo", {msg: "Código enviado"})
        })

    }).catch((erro) => {
        res.redirect("/")
    })
})

usuarioRouter.post("/validarCodigo", (req, res)=>{
    let codigo = req.body.codigo

    codigoModel.findOne({
        where:{cod: codigo}
    }).then((cad)=>{
        if(!cad){
            res.render("validarCodigo", {msg: "Código inválido"})
        }else{
            res.render("changePassword", {codigo: codigo})
        }
    })
})

usuarioRouter.post("/changePass", async (req, res)=> {
    const codigo = req.body.codigo;

    let newPass = req.body.newPass
    let email = (await codigoModel.findOne({
        where: { cod: codigo }
    })).usuarioEmail

    usuarioModel.update(
        { senha: newPass },
        { where: {email: email}}
    ).then(() =>{
        codigoModel.destroy({
            where: {cod: codigo}
        })
        res.redirect("/login")
    })

})

usuarioRouter.post("/deslogar", (req,res) => {
    res.clearCookie("medcar_token")
    res.redirect("/")
})

usuarioRouter.post("/login", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha

    const jwt = require("jsonwebtoken")

    usuarioModel.findOne({
        where:{email: email, senha: senha}
    }).then(async(user)=>{
        if(user){
            let usuario = {
                email: user.email,
                nome: user.nome,
                senha: user.senha,
                permissao: user.tipo_permissao,
                exp: Date.now() + ((60000 * 60) * 8),
            }
            let token = jwt.sign(usuario, process.env.SECRET_KEY)
            res.cookie("medcar_token", token, {
                httpOnly: true,
            })
            res.redirect("status")
        }else {
            res.render("err/erro_mensagem", {erro_mensagem: "Usuário não encontrado"})
        }
    }).catch((erro) => {
        res.redirect("/") 
    })
})

usuarioRouter.get("/status", async(req,res) => {
    let email;
    jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY,
        (erro, decoded) => {
            email = decoded.email
        }
    )

    const servicos = (await servicosModel.findAll({
        where: { usuarioEmail: email },
    })).map(servico => servico.descricao) || [];
    const placa = (await servicosModel.findOne({
        where: { usuarioEmail: email },
    }))
    res.render("status", { servicos: servicos, placa: placa })
})

usuarioRouter.get("/deleteUser/:email", (req,res) => {
    let email = req.params.email
    usuarioModel.destroy({
        where: {email:email}
    }).then(() => {
        res.redirect("/gerenciamento")
    }).catch(() => {
        res.redirect("/gerenciamento")
    })
})

usuarioRouter.get("/forgetPassword/:msg?", (req,res) => {
    let msg = req.params.msg ?? null
    res.render("validarEmail", {msg})
})

module.exports = usuarioRouter