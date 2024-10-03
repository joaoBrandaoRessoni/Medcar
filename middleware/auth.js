const auth = (req,res,next) => {
    res.cookie("jwt", "hdkfydfudhfiei")
    console.log(req.cookies);

    next()
}

module.exports = auth;