const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const { signupPage, signup, loginPage, login, logout } = require('../controllers/userController');
const user = require('../models/user');
const { saveRedirectURL } = require('../middlewares/isLoggedIn');

userRouter.get('/signup', signupPage);
userRouter.post('/signup', signup);
userRouter.get('/login', loginPage);
userRouter.post('/login', saveRedirectURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);
userRouter.get('/logout', logout);

module.exports = userRouter;