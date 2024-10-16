//Express import
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

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
const adminRouter = require("./routes/admin")

//Set routers on app
app.use(usuarioRouter)
app.use(adminRouter)

//Checking if are logged in
app.use((req,res,next) => {
    let token = req.cookies.medcar_token
    if(token != undefined){
        res.locals.login = true
    }
    else{
        res.locals.login = false
    }
    next()
})

connection.authenticate()
    .then(() => {
        console.log("Conectado ao banco")
    })
    .catch(erro=>{
        console.log("Não foi possivel conectar")
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

app.listen(8181, (erro) => {
    if(erro){
        console.log("Erro")
    }else{
        console.log("Rodando")
    }
})
