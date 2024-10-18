const express = require("express")
const servicoRouter = express.Router()
const carrosModel = require("../database/carrosModel")
const servicoModel =  require("../database/servicosModel")
const jwt = require('jsonwebtoken')

let servicos = []

servicoRouter.post("/saveservico", (req, res)=>{
    let servico = req.body.inp_servico
    let placa = req.body.inp_placa
    let email;
    jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY,
        (erro, decoded) => {
            email = decoded.email
        }
   )

    carrosModel.findOne({
        where:{placa: placa}
    }).then((cad) =>{
        if (!cad){
            carrosModel.create({
                placa: placa,
                modelo: 'teste',
                usuarioEmail: email
            })
        }
    })
    
    servicoModel.findOne({
        where:{
            descricao: servico,
            placaCarro: placa
        }
    }).then((servicoExistente) => {
        if (servicoExistente) {
            res.send('Esse serviço já está linkado com essa placa')
        } else {
            servicoModel.create({
                placaCarro: placa,
                usuarioEmail: email,
                descricao: servico,
            }).then((novoServico) => {
                // Adiciona o novo serviço ao array servicos
                servicos.push({
                    placa: novoServico.placaCarro,
                    descricao: novoServico.descricao
                })
                res.render('cadastroServico', { servicos });
            }).catch((erro) => {
                res.status(500).send("Erro ao salvar o serviço.");
            })
        }
    }).catch((erro) => {
        res.status(500).send("Erro ao buscar o serviço existente.");
    })
})

servicoRouter.get("/cadastroServico", (req, res)=>{
    servicos = []
    res.render("cadastroServico", {servicos})
})

module.exports = servicoRouter