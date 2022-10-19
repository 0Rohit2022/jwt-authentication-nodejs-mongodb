const jwt = require('jsonwebtoken');
const server = require('../models/conne');

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET);
        console.log(verifyUser);


        const user = await server.findOne({_id:verifyUser._id});
        console.log(user);

        req.token  = token;
        req.user = user;
         
        next();
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports = auth;