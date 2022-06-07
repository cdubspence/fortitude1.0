const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport)
//mongoose
// pass SvQLYhn6QmwLJP95
mongoose.connect('mongodb+srv://casey:SvQLYhn6QmwLJP95@cluster0.gbebh.mongodb.net/?retryWrites=true&w=majority',
     {useNewUrlParser: true, useUnifiedTopology : true})
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
app.use(passport.initialize());
app.use(passport.session());

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