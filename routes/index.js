const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth.js');

//login page
router.get('/', (req, res) => {
    res.render('index');
});

//register page
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/membership', ensureAuthenticated, (req, res) => {
    console.log(req);
    res.render('membership', {
        user: req.user
    });
})
module.exports = router;