module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
};

module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}