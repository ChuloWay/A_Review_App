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
router.get('/', handleAsync(index));


router.get('/new', isLoggedIn, (renderNewForm));

router.post('/', isLoggedIn, validateRestaurant, handleAsync(createRestaurant));

router.get('/:id', handleAsync(showRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, handleAsync(renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateRestaurant, handleAsync(updateRestaurant));

router.delete('/:id', isLoggedIn, isAuthor, handleAsync(deleteRestaurant));

module.exports = router;
