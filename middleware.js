// module.exports.isLoggedIn = (req, res, next) => {
//     console.log("two");
//     if (!req.isAuthenticated()) {
//         console.log("two two");
//         req.flash('error', 'You Must Be Logged In First!');
//         req.session.returnTo = req.originalUrl;
//         return res.redirect('/login');
//     }
//     next();
// }


module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    req.flash('error', 'You Must Be Logged In First!');

    req.session.returnTo = req.originalUrl;
    return res.redirect(`/login`);
}
