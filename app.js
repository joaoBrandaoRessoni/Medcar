const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))

const connection = require("./database/database")

connection.authenticate()
    .then(() => {
        console.log("Conectado ao banco")
    })
    .catch(erro=>{
        console.log("Não foi possivel conectar")
    })

app.get("/", (req,res)=>{
    res.send("Rota Home")
})

app.get("/cadastro", (req,res)=>{
    let email = req.body.email
    let senha = req.body.senha
    let nome = req.body.nome
    let cpf = req.body.cpf ?? null
    let telefone = req.body.telefone ?? null

    
})

app.listen(8181, (erro) => {
    if(erro){
        console.log("Erro")
    }else{
        console.log("Rodando")
    }
})