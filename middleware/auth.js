const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {
    const nonSecurePath = ["/", "/login", "/register", "/forgetPassword"]
    if(nonSecurePath.includes(req.path)) return next()

    try{
        const verify = jwt.verify(req.cookies.jwt, "shh")
        console.log(verify.email);
        next()
    }catch(erro){
        res.status(400).send("Invalid Token!")
    }
}

module.exports = auth;