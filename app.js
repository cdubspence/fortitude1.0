const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

//express
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected'))
.catch((err) => console.log(err));

//EJS
app.set('view engine', 'ejs')
app.use(expressEjsLayout);

//bodyparser
app.use(express.urlencoded({extended: false }));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
next();
})

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(3000);