"use strict";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');

exports.signup = function (req, res, next) {
   const nickname = req.body.nickname;
   const email = req.body.email;
   const password = req.body.password;

   bcrypt.hash(password, 12)
         .then(hashedPw =>{
            const user = new User({
                nickname: nickname,
                email: email,
                password: hashedPw
            });
            return user.save();
         }) 
         .then(result =>{
            res.status(201).json({ message: 'Utilisateur crée',
            nickname : nickname,
            email: email,
            userId: result._id
            });
         })
         .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
         });
};

exports.login = (req,res, next) =>{
   const email = req.body.email;
   const password = req.body.password;
   let loadedUser;
   User.findOne({ email: email })
      .then(user =>{
         if(!user){
            const error = new Error('Utilisateur non trouvé');
            error.statusCode = 401;
            throw error;
         }
         loadedUser = user;
         return bcrypt.compare(password, user.password);
      })
      .then(isEqual =>{
         if(!isEqual){
            const error = new Error('mot de passe incorrect');
            error.statusCode = 401;
            throw error;
         }
         const token = jwt.sign(
            {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
            roles: loadedUser.roles
         },
            process.env.SECRET_JWT,
            {expiresIn: '1h' }
         );
         res.status(200).json({ token: token, userId: loadedUser._id.toString(), roles: loadedUser.roles });//userId faculatif//token encoding checked in jwt.io
      })
      .catch(err =>{
         if(!err.statusCode){
            err.statusCode = 500;
         }
         next(err);
      });
};

exports.deleteUser = (req, res, next) => {
   
   const authHeader = req.get("Authorization");
   const token = authHeader.split(" ")[1];
   const decodedToken = jwt.verify(token, `${process.env.SECRET_JWT}`);
   const id = req.params.id;
   const userId = decodedToken.userId;
   const roles = decodedToken.roles;

   User.findById(id)
    .then(resultat=>{
        if(resultat._id != userId && roles == "user"){   
            return res.status(401).json({message : "Vous n'avez pas l'autorisation de supprimer ce compte"});
        }else{
         let _id = resultat.id;
            User.deleteOne({_id})
            .then(result =>{
                res.status(201).json({
                    message: "L'utilisateur a été supprimé avec succès!",
                    user: result
                });
                });
        }
    })
    .catch(error=>{
        console.log(error);
    });
};

exports.findUser = (req, res, next) => {
   const searchQuery = { _id: req.params.id };
   User.find(searchQuery).select('nickname')
   .then(result =>{
       res.status(201).json({
           message: 'User found!',
           user: result
       });
       }).catch(err =>{
           if(!err.statusCode){
               err.statusCode = 500;
           }
           next(err);
       });
};

exports.updateUser = (req, res, next) => {
   
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, `${process.env.SECRET_JWT}`);
      const id = req.params.id;
      const userId = decodedToken.userId;
      const roles = decodedToken.roles;
   
      User.findById(id)
       .then(resultat=>{
           if(resultat._id != userId || roles == "admin"){   
               return res.status(401).json({message : "Vous ne pouvez modifier que votre compte utilisateur"});
           }else{
            let _id = req.params.id;
               User.findByIdAndUpdate(req.params.id, req.body, {
                                new: true,
                                runValidator: true
                            })
               .then(result =>{
                   res.status(201).json({
                       message: "L'utilisateur a été modifié avec succès!",
                       user: result
                   });
                   });
           }
       })
       .catch(error=>{
           console.log(error);
       });
   };

exports.getLoginPage = (req, res)=>{
      res.json({message : "Bienvenue à la page de connexion"});
   }; 
