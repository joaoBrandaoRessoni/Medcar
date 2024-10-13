const express = require("express")
const servicoRouter = express.Router()
const servicoModel =  require("../database/servicosModel")
const carrosModel = require("../database/carrosModel")

let servicos = []

servicoRouter.post("/saveservico", (req, res)=>{
    let servico = req.body.inp_servico
    let placa = req.body.inp_placa
    let email = req.body.inp_email

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
                descricao: servico
            }).then((novoServico) => {
                // Adiciona o novo serviço ao array servicos
                servicos.push({
                    id: novoServico.id, // Atribui o ID gerado pelo banco
                    descricao: novoServico.descricao
                });
                res.render('cadastroServico', { servicos });
                console.log("Serviço inserido com sucesso.");
            }).catch((erro) => {
                console.log(erro);
                res.status(500).send("Erro ao salvar o serviço.");
            })
        }
    }).catch((erro) => {
        console.log(erro);
        res.status(500).send("Erro ao buscar o serviço existente.");
    })
})

servicoRouter.get("/cadastroServico", (req, res)=>{
    servicos = []
    res.render("cadastroServico", {servicos})
})

module.exports = servicoRouter