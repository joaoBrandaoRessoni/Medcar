const express = require("express")
const usuarioRouter = express.Router()
const usuarioModel = require("../database/usuarioModel")
const codigoModel = require("../database/codigoModel")
const nodemailer = require("nodemailer")


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
        res.redirect("/")
    }).catch((erro) => {
        res.redirect("/register/Email já cadastrado")
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
            },
            tls: {
                ciphers:'SSLv3'
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
            res.render("validarEmail", {msg: "Email enviado"})
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
            res.render("validarEmail", {msg: "Codigo invalido"})
        }else{

            res.redirect(`changePassword?codigo=${codigo}`)
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
        res.redirect("/")
    })

})

usuarioRouter.post("/login", (req,res) => {
    let email = req.body.email
    let senha = req.body.senha

    usuarioModel.findOne({
        where:{email: email, senha: senha}
    }).then((user)=>{
        if(user){
            res.redirect("/status")
        }else {
            res.render("login", {msg: "Usuario não encontrado"})
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

usuarioRouter.get("/changePassword", (req, res) => {
    const codigo = req.query.codigo;
    console.log("codigo da query: "+ codigo)
    if (codigo) {
        res.render("changePassword", {codigo: codigo})
    }
})

usuarioRouter.get("/forgetPassword/:msg?", (req,res) => {
    let msg = req.params.msg ?? null
    res.render("validarEmail", {msg})
})

module.exports = usuarioRouter
