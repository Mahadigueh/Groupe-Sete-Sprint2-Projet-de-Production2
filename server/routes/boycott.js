const express = require('express');
const isAuth = require('../middleware/is-auth');
const upload = require('../middleware/uploadImg');

const router = express.Router();

const boycottsController = require('../controllers/boycottsController');

// GET ALL BOYCOTT
router.get('/boycotts', boycottsController.getBoycotts);

// CREATE BOYCOTT
router.post('/boycott', isAuth, upload.single('photos'), boycottsController.createBoycott); //isAuth: need to be authenticated

//GET STATUS 
router.get('/status', boycottsController.getStatus);//Pour s'assurer que l'API fonctionne

// GET SIGNUP PAGE
router.get('/signup', boycottsController.getSignup); //Pour afficher la page d'inscription

// UPDATE BOYCOTT
router.put('/boycott/update/:id', isAuth, upload.single('photos'), boycottsController.updateBoycott);

// DELETE BOYCOTT
router.delete('/boycott/delete/:id', isAuth, boycottsController.deleteBoycott);

// FIND BOYCOTT BY ID
router.get('/boycott/:id', boycottsController.findBoycott);

// LIKE A BOYCOTT
router.post('/like/:id', isAuth, boycottsController.likeBoycott);

module.exports = router;