const passport = require("passport");
const userController = require("./userController");

exports.login = (req, res) => {
    res.render('login', {message: req.flash('error'), layout: 'main'});
}

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }

        // Authenticate the user and store user information in the session
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            res.redirect('/user');
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
}