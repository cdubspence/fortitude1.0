const express = require('express');
const router = express.Router();

//login page
router.get('/', (req, res) => {
    res.render('membership');
});

//register page
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;