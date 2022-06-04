const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

//login handle
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});

//register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    console.log('Name: ' + name + ' Email: ' + email + ' Password: ' + password);
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
    }
    //check length and match
    if (password.length < 6) {
        errors.push({msg: "Password must be at least 6 characters"})
    } else if (password != password2) {
        errors.push({msg: "Passwords must match!"})
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password, 
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({email: email}).exec((err, user)=> {
            console.log(user);
            if (user) {
                errors.push({msg: 'Account with this Email already exists.'});
                render(res, errors, name, email, password, password2);
            } else {
                const newUser = new User({
                    name: name, 
                    email:email,
                    password: password, 
                });
                bcrypt.genSalt(10,(err, salt)=>
                bcrypt.hash(newUser.password, salt,
                    (err, hash) => {
                        if (err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then((value) => {
                            console.log(value)
                            req.flash('success_msg', 'Registration Complete!')
                            res.redirect('/user.login');
                        })
                        .catch(value => console.log(value));
                    }));
            } //else ends here
        })
    }
});

router.post('/login', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/membership',
        failureRedirect: '/user/login',
        failureFlash: true,

    }) (req, res, next);
});

//logout
router.get('/logout', (req, res) => {
    
});

module.exports = router