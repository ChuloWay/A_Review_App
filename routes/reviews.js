const express = require('express');
const router = express.Router({mergeParams:true});

const handleAsync = require('../Utility/handleAsync');
const ExpressError = require('../Utility/ExpressError');

const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// all routes for reviews start with '/' repping == /restaurants/:id/reviews/

router.post('/', validateReview, handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review)
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${id}`)
}))

router.delete('/:reviewId', handleAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);

}))

module.exports= router;