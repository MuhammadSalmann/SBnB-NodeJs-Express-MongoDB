const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');

// Signup Page
const signupPage = (req, res) => {  
    res.render('users/signup.ejs');
}

// Signup Route
const signup = wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to SBnB!');
        res.redirect('/listings');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
});

// Login Page
const loginPage = (req, res) => {
    res.render('users/login.ejs');
}

// Login Route
const login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/listings');
}

module.exports = { signupPage, signup, loginPage, login };