"use strict";

const express = require("express");

const authController = require('../controllers/authController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// LOGIN USER
router.post('/auth/login', authController.login);

// GET LOGIN PAGE
router.get('/login', authController.getLoginPage);

// CREATE USER
router.post('/auth/signup', authController.signup);

// UPDATE USER
router.put('/user/update/:id', isAuth, authController.updateUser); 

// DELETE USER
router.delete('/user/delete/:id', authController.deleteUser);

// FIND USER BY ID
router.get('/user/:id', authController.findUser);

module.exports = router;