const express = require('express');
const router = express.Router();
const passport = require('passport');
const handleAsync = require('../Utility/handleAsync');
const User = require('../models/user');
const {isLoggedIn} = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', handleAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${req.body.username}!`);
            res.redirect('/restaurants');
        })
    } catch (err) {
        req.flash('error', err.message);
    
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    if (req.query.origin) {
        req.session.returnTo = req.query.origin;
    } else {
        req.session.returnTo = req.header('Referer');
    }
    // console.log("req.session.returnTo: ", req.session.returnTo);
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    let redirectUrl = '/restaurants'
    console.log("req.session.returnTo: ", req.session.returnTo);
    req.flash('success', `Welcome back ${req.user.username}!`);
    if (req.session.returnTo) {
        console.log("sksksksks");
        redirectUrl = req.session.returnTo
        delete req.session.returnTo
    }
    console.log(redirectUrl);
    res.redirect(redirectUrl);
});

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', `Welcome back ${req.user.username}!`);
//     if(req.session.returnTo !== undefined){
//         res.redirect(req.session.returnTo)
//     }
//     else{
//         res.redirect('/restaurants');
//     }
// });

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/restaurants');
    })
})

module.exports = router;



