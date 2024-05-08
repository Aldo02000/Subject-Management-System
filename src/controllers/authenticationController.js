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

            //TODO: CHECK FOR USER ROLE AND RENDER SPECIFIC PAGE

            userController.renderUserPage(user, res);

            // res.redirect('/user');

            // Authentication successful, generate the redirect URL with the user ID
            // const redirectURL = `/welcome`;

            // Redirect to the generated URL
            // return res.redirect(redirectURL);
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    })
}