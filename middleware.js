const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Logged In First!');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;