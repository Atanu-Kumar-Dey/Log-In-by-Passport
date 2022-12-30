const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const passport = require('passport');

// Log in route
router.get("/login", (req, res) => {
    res.render("login")
})

// Register route
router.get("/register", (req, res) => {
    res.render("register")
})

// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


// Log in handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err) => {
        if (err) {
            console.log('Eroor occured');

        }
        req.logIn('local', (user, err) => {
            if (err) {
                console.log('Error occured in login method')
            } else if (!user) {
                console.log('Not User Found');
            } else {
                res.redirect('/dashboard')
            }
        })
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut((err => {
        console.log(err)
    }));
    res.redirect('/')
})

module.exports = router