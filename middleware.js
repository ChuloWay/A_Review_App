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

const { restaurantSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./Utility/ExpressError');
const Restaurant = require('./models/restaurant');
const Review = require('./models/review');




module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Logged In First!');
        return res.redirect(`/login`);
    }
    next();
};


// Used to valdiate the req.body user fills in
module.exports.validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const restaurants = await Restaurant.findById(id);
    if(!restaurants.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}