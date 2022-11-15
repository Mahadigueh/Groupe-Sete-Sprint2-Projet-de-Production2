"use strict";
const Boycott = require('../models/boycott');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
dotenv.config(); 

exports.getBoycotts = (req, res, next) =>{
    const pageSize = req.query.pageSize;
    const page = req.query.page; 

    Boycott.find().limit(pageSize).skip(page)
    .then(boycotts => {
        if(!boycotts){
            const error = new Error('Aucun boycott trouvé');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Boycotts récupérés',
            boycotts: boycotts
        });
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createBoycott = (req, res, next) =>{
    const title = req.body.title; 
    const resume = req.body.resume;
    const description = req.body.description;
     
    const boycott = new Boycott({
        title: title,
        resume: resume,
        description: description,
        photos: req.file.path,
        userId: req.user.userId
    });
    boycott.save()
    .then(result =>{
        res.status(201).json({
            message: 'boycott enregistré!',
            boycott: result
        });
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateBoycott = async (req, res, next) =>{

    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.SECRET_JWT}`);
    const userId = decodedToken.userId;
    const roles = decodedToken.roles;
    let boycottID = req.params.id; 

    let boycott = Boycott.findById(boycottID); 

    const title = req.body.title;
    const resume = req.body.resume;
    const description = req.body.description;

    const update = {
        title: title,
        resume: resume,
        description: description,
        photos: req.file.path,
    };
    
    Boycott.findByIdAndUpdate(boycottID, update, {
                new: true,
                runValidator: true
    })
    .then(resultat=>{
        if(resultat.userId != userId && roles != "admin"){
            res.status(401).json("Vous n'avez pas le droit")
        }else{
            res.json({
                message: "Les informations du boycott ont été modifiés avec succès.",
                updated : resultat,
            });
        }})
    .catch(error =>{
        res.status(404).send()
    })
    };

exports.getStatus = (req, res)=>{
        res.send("L'API fonctionne correctement");
    }; 

exports.getSignup = (req, res)=>{
        res.json({
            message : "Bienvenue à la page d'inscription."
        });
    };

exports.deleteBoycott = (req, res, next) => {
    const id = req.params.id;
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.SECRET_JWT}`);
    const userId = decodedToken.userId;
    const roles = decodedToken.roles;

    Boycott.findById(id)
    .then(resultat=>{
        if(resultat.userId != userId && roles == "user"){
            return res.status(401).json({message : "Vous n'avez pas l'autorisation de supprimer ce boycott"});
        }else{
            let _id = resultat.id;
            Boycott.deleteOne({_id})
            .then(result =>{
                res.status(204).send();
            })
        }
    })
    .catch(error=>{
        res.status(404).send("ID introuvable")
    });
};

exports.findBoycott = (req, res, next) => {
    const searchQuery = { _id: req.params.id };
    Boycott.find(searchQuery)
    .then(result =>{
        res.status(200).json({
            message: 'Boycott trouvé!',
            boycott: result
        });
        }).catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.likeBoycott = (req, res, next) => {
    const searchQuery = { _id: req.params.id };
    
    Boycott.findOne(searchQuery)
      .then(result =>{
        
        if(!result.usersLiked.includes(req.body.userId) && req.body.like === 1){
            Boycott.updateOne(
             {_id: req.params.id}, 
             {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
             } 
            )
            .then(() =>{
                res.status(201).json({ message: "Boycott like: 1"});
            })
            .catch(err =>{
                res.status(400).json({err});
            });
        }

        if(result.usersLiked.includes(req.body.userId) && req.body.like === 0){
            Boycott.updateOne(
             {_id: req.params.id}, 
             {
                $inc: {likes: -1},
                $pull: {usersLiked: req.body.userId}
             } 
            )
            .then(() =>{
                res.status(201).json({ message: "Boycott like: 0"});
            })
            .catch(err =>{
                res.status(400).json({err});
            });
        }
      })
      .catch(err =>{
        res.status(404).json({err});
    }); 
};

//>>>>>>> main
