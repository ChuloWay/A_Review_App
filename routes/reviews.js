const express = require('express');
const router = express.Router({mergeParams:true});

const handleAsync = require('../Utility/handleAsync');
const ExpressError = require('../Utility/ExpressError');

const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// all routes for reviews start with '/' repping == /restaurants/:id/reviews/

router.post('/', isLoggedIn, validateReview, handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Created New Review'); 
    res.redirect(`/restaurants/${id}`)
}))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, handleAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted!')
    res.redirect(`/restaurants/${id}`);

}))

module.exports= router;