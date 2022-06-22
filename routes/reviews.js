const express = require('express');
const router = express.Router({mergeParams:true});

const handleAsync = require('../Utility/handleAsync');
const ExpressError = require('../Utility/ExpressError');

const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// reviews Controller
const { createReview, deleteReview } = require('../controllers/reviews');


// all routes for reviews start with '/' repping == /restaurants/:id/reviews/

router.post('/', isLoggedIn, validateReview, handleAsync(createReview));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, handleAsync(deleteReview));

module.exports= router;