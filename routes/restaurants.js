const express = require('express');
const router = express.Router();

// controllers
const { index, renderNewForm,
    createRestaurant,
    showRestaurant,
    renderEditForm,
    updateRestaurant,
    deleteRestaurant } = require('../controllers/restaurants');

const handleAsync = require('../Utility/handleAsync');

const Restaurant = require('../models/restaurant');
const { isLoggedIn, validateRestaurant, isAuthor } = require('../middleware');


// all routes for restaurants start with '/' repping = /restaurants
router.route('/')
.get( handleAsync(index))
.post( isLoggedIn, validateRestaurant, handleAsync(createRestaurant));

router.get('/new', isLoggedIn, (renderNewForm));

router.get('/:id/edit', isLoggedIn, isAuthor, handleAsync(renderEditForm));

router.route('/:id')
.get( handleAsync(showRestaurant))
.put( isLoggedIn, isAuthor, validateRestaurant, handleAsync(updateRestaurant))
.delete( isLoggedIn, isAuthor, handleAsync(deleteRestaurant));


module.exports = router;
