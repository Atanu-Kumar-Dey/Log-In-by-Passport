const LocalStratagy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User Model
const User = require("../models/user");

module.exports = (passport) => {
    passport.use(
        new LocalStratagy({ usernameField: "email" }, (email, password, done) => {
            // Math the user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "Email not registerd"
                        });
                    }

                    // Math password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Incorrect password" })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}