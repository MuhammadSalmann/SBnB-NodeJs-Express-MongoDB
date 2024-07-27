const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const { signupPage, signup, loginPage, login, logout } = require('../controllers/userController');
const user = require('../models/user');
const { saveRedirectURL } = require('../middlewares/isLoggedIn');

userRouter.route('/signup')
.get(signupPage)
.post(signup);

userRouter.route('/login')
.get(loginPage)
.post(saveRedirectURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

userRouter.get('/logout', logout);

module.exports = userRouter;