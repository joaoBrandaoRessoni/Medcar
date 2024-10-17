//Express import
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

//Chama todas as tabelas para criar suas chaves estrangeiras na sequencia correta
const syncTabelas = require("./database/syncTabelas")

//Set engine and public path
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Set cookie parser
app.use(cookieParser())

//middleware
const auth = require("./middleware/auth")
app.use(auth)

//Database connection and models
const connection = require("./database/database")
const usuarioModel = require("./database/usuarioModel")

//Routers
const usuarioRouter = require("./routes/usuario")
const servicoRouter = require("./routes/servicos")
const adminRouter = require("./routes/admin")

//Set routers on app
app.use(usuarioRouter)
app.use(servicoRouter)

app.use(adminRouter)

connection.authenticate()
    .then(() => {
        console.log("Conectado ao banco")
    })
    .catch(erro=>{
        console.log("Não foi possivel conectar")
    })

    app.get("/", (req,res)=>{
        let token = req.cookies.medcar_token
        if (token != undefined) {
            res.locals.login = true
        }
        else {
            res.locals.login = false
        }
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
