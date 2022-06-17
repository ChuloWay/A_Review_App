const express = require('express');
const router = express.Router();
const passport = require('passport');
const handleAsync = require('../Utility/handleAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', handleAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.flash('success', 'Welcome Buddy!');
        res.redirect('/restaurants');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Buddy');
    res.redirect('/restaurants');
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/restaurants');
    })
})

module.exports = router;



