const User = require('../models/user');


module.exports.renderRegister =  (req, res) => {
    res.render('users/register');
};

module.exports.registered = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to RestView !`);
            res.redirect('/restaurants');
        })
    } catch (err) {
        req.flash('error', err.message);

        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    if(req.query.returnTo){
        req.session.returnTo= req.query.returnTo;
    }
    res.render('users/login');
};

module.exports.loggedIn = (req, res) => {
    req.flash('success', `Welcome Back ${req.body.username}`)
    const redirectUrl = res.locals.returnTo || '/restaurants';
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logout(() => {
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/restaurants');
    })
};