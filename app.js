//Express import
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer");

//Set engine and public path
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Database connection and models
const connection = require("./database/database")
const usuarioModel = require("./database/usuarioModel")

//Routers
const usuarioRouter = require("./routes/usuario")

//Set routers on app
app.use(usuarioRouter)

connection.authenticate()
    .then(() => {
        console.log("Conectado ao banco")
    })
    .catch(erro=>{
        console.log("Não foi possivel conectar")
    })

var remetente = nodemailer.createTransport({
    host: 'localhost',
    service: 'localhost:8181/',
    port: 8181,
    secure: false, 
    auth:{ 
        user: 'marialuiza@nerypinto@yahoo.com.br',
        pass: '1234'
    },
    tls: {
        ciphers:'SSLv3'
    }
})

var emailASerEnviado = {
    from: 'marialuiza@nerypinto@yahoo.com.br',
    to: 'joao_ressoni@hotmail.com',
    subject: 'Enviando Email com Node.js teste',
    text: 'Estou te enviando este email com node.js'
}

app.get("/email", (req, res)=>{
    remetente.sendMail(emailASerEnviado, function(error){
        if (error) {
            console.log("Erro do email")
            console.log(error);
        } else {
            console.log('Email enviado com sucesso.');
        }
    });
})

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/register/:msg?", (req, res) => {
    let msg = req.params.msg ?? null
    res.render("index", {msg})
})

app.get("/login", (req, res) => {
    res.render("login", {msg: ""})
})

app.get("/allUsers", (req,res) => {
    usuarioModel.findAll().then((users) => {
        res.render("gerenciamento", {users})
    })
})

app.listen(8181, (erro) => {
    if(erro){
        console.log("Erro")
    }else{
        console.log("Rodando")
    }
})