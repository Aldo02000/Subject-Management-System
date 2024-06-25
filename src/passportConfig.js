const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./models/dbConnection');
const userService = require('./services/userService');

function initPassport() {

    // Configure the local strategy for use by Passport.
    passport.use('local',new LocalStrategy(
        async function (username, password, done) {

            const user = await userService.findUser(username).then(function (user) {
                return user;
            })

            if (user.hasPassword(password)) {
                return done(null, user);
            }
            return done(null, false, {message: 'Invalid password'});
        }
    ));

    // Serialize the user object to the session.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // Deserialize the user object from the session.
    passport.deserializeUser(function (user, done) {
        return  done(null, user);
    });


}

module.exports = { initPassport };