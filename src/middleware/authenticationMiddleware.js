exports.checkAuthentication = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    next();
}

exports.checkAuthenticationSuccess = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("redirected to /user.")
        res.redirect('/user');
    }
    next();
}