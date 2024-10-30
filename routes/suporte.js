const express = require("express")
const suporteRouter = express.Router()
const perguntaModel = require('../database/perguntaModel')
const respostaModel = require('../database/respostaModel')
const usuarioModel = require('../database/usuarioModel')
const jwt = require('jsonwebtoken')

suporteRouter.get("/suporte", (req, res) => {
    let email;
    jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY,
        (erro, decoded) => {
            email = decoded.email
        }
    )

    perguntaModel.findAll({where: {emailUsuario: email}}).then(perguntas => {
        res.render("suporte", {"perguntas": perguntas});
    })
})

suporteRouter.post("/suporte/perguntar", (req,res) => {
    let titulo = req.body.titulo
    let pergunta = req.body.pergunta
    let email;
    jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY,
        (erro, decoded) => {
            email = decoded.email
        }
    )

    perguntaModel.create({
        emailUsuario: email,
        titulo: titulo,
        pergunta: pergunta
    }).then(() => {
        res.redirect("/suporte");
    }).catch(erro => {
        res.redirect("/suporte");
    })
})

suporteRouter.get("/suporte/pergunta/:id", (req, res) => {
    perguntaModel.findOne({where: {id: req.params.id}, include: "usuario"}).then(pergunta => {
        respostaModel.findAll({where: {pergunta_id: req.params.id}, include: "usuario"}).then(respostas => {
            res.render("resposta", {"pergunta":pergunta, "respostas":respostas})
        })
        
    })
})

suporteRouter.post("/suporte/responder/:id", (req, res) => {
    let email;
    jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY,
        (erro, decoded) => {
            email = decoded.email
        }
    )
    respostaModel.create({
        pergunta_id: req.params.id,
        emailUsuario: email,
        resposta: req.body.resposta
    }).then(() => {
        res.redirect("/suporte/pergunta/"+req.params.id)
    })
})

suporteRouter.get("/suporte/perguntas/gerenciamento", (req,res) => {
    perguntaModel.findAll({include: "usuario"}).then(perguntas => {
        res.render("todasPerguntas", {"perguntas": perguntas})
    })
})

module.exports = suporteRouter