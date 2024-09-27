//Express import
const express = require("express")
const app = express()
const bodyParser = require("body-parser")

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

app.get("/", (req,res)=>{
    res.render("index")
})

app.listen(8181, (erro) => {
    if(erro){
        console.log("Erro")
    }else{
        console.log("Rodando")
    }
})