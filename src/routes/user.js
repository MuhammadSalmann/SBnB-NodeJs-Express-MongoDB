const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const { signupPage, signup, loginPage, login } = require('../controllers/userController');

userRouter.get('/signup', signupPage);
userRouter.post('/signup', signup);
userRouter.get('/login', loginPage);
userRouter.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

module.exports = userRouter;