"use strict";

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//check if request has valid tokens

module.exports = (req, res, next) =>{
    const authHeader = req.get("Authorization");
    if(!authHeader) {
        res.status(401).send({ error: "not authenticated" });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.SECRET_JWT); 
    } catch(err) {
        err.statusCode = 401;
        throw err;
    }
    if(!decodedToken){
        const error = new Error("not authenticated");
        error.statusCode = 401;
        throw error;
    }
    //put undecoded token in request to be used for authentication
    req.user = decodedToken;
    console.log('decodedToken', decodedToken);
    next();
};