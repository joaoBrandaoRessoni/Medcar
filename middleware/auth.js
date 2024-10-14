const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {
    //Array com as rotas que não precisam de segurança JWT, sempre coloque '/' seguido do nome da rota 
    const nonSecurePath = ["login", "register", "forgetPassword", "createUser", "validarEmail", "validarCodigo", "changePass"]
    //Caso a rota estiver na array irá passar direto sem a verificação de JWT
    let path = req.path.split("/")[1]
    if(nonSecurePath.includes(path) || path == "") return next()

    //Checking if are logged in
    let token = req.cookies.medcar_token
    if(token != undefined){
        res.locals.login = true
    }
    else{
        res.locals.login = false
    }
    next()

    try{
        jwt.verify(req.cookies.medcar_token, process.env.SECRET_KEY, null, 
            (erro, decoded) => {
                if(Date.now() >= decoded.exp){
                    throw new Error("jwt has expired")
                }
            }
        )
        next()
    }catch(erro){
        let mensagem;
        if(erro.message == "jwt must be provided"){
            mensagem = "Parece que você não fez o login ainda"
        }else if(erro.message == "jwt has expired"){
            mensagem = "Sua sessão expirou, faça o login novamente"
        }else{
            mensagem = "Houve um erro ao tentar fazer sua autenticação"
        }
        res.render("err/erro_mensagem", {erro_mensagem: mensagem})
    }
}

module.exports = auth;
