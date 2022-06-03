var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyparser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose =
        require('passport-local-mongoose'),
    User = require('./models/user');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/fortitude');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: 'Youve reached the membership area',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========
//Routes
//===========

//show home page
app.get('/', function (req, res) {
    res.render('index');
});

//show secret or membership area
app.get('/secret', isLoggedIn, function (req, res) {
    res.render('secret');
});

//register form
app.get('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({ username: username }),
        password, function (err, user) {
            if (err) {
                console.log(err);
                return res.render('register');
            }
            passport.authenticate('local') (
                req, res, function () {
                    res.render('secret');
                }
            );
        });
});

//show login form
app.get('login', function (req, res) {
    res.render('login');
});

//handle user login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function (req, res) {

});

//handle user logout
app.get('logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server has started!');
});