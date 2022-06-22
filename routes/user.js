const express = require('express');
const router = express.Router();
const passport = require('passport');
const handleAsync = require('../Utility/handleAsync');
const User = require('../models/user');
const { renderRegister, registered, renderLogin, loggedIn, logOut } = require('../controllers/users');

router.get('/register', renderRegister);


router.post('/register', handleAsync(registered));

// router.get('/login', (req, res) => {
//     if (req.query.origin) {
//         req.session.returnTo = req.query.origin;
//     } else {
//         req.session.returnTo = req.header('Referer');
//     }
//     // console.log("req.session.returnTo: ", req.session.returnTo);
//     res.render('users/login');
// });

router.get('/login', renderLogin );

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     let redirectUrl = '/restaurants'
//     console.log("req.session.returnTo: ", req.session.returnTo);
//     req.flash('success', `Welcome back ${req.user.username}!`);
//     if (req.session.returnTo) {
//         console.log("sksksksks");
//         redirectUrl = req.session.returnTo
//         delete req.session.returnTo
//     }
//     console.log(redirectUrl);
//     res.redirect(redirectUrl);
// });

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loggedIn);

router.get('/logout',logOut)

module.exports = router;



