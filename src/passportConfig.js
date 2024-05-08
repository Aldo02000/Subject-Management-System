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
        done(null, user.id);
    });

    // Deserialize the user object from the session.
    passport.deserializeUser(function (id, done) {
        connection.query('SELECT * FROM User WHERE Id = ?', [id], function (error, results, fields) {
            if (error) return done(error);

            if (results.length === 0) {
                return done(null, false);
            } else {
                return done(null, results[0]);
            }
        });
    });


}

module.exports = { initPassport };