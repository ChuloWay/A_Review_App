const express = require('express');
const router = express.Router();
const handleAsync = require('../Utility/handleAsync');
const { restaurantSchema } = require('../schemas');

const ExpressError = require('../Utility/ExpressError');
const Restaurant = require('../models/restaurant');
const passport = require('passport');
const {isLoggedIn} = require('../middleware');


const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// all routes for restaurants start with '/' repping = /restaurants
router.get('/', handleAsync(async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
}))


router.get('/new',isLoggedIn, (req, res) => {
    res.render('restaurants/new');
})

router.post('/',isLoggedIn, validateRestaurant, handleAsync(async (req, res, next) => {
    const restaurants = new Restaurant(req.body.restaurant);
    await restaurants.save();
    req.flash('success', 'Created New Restaurant')
    res.redirect(`/restaurants/${restaurants._id}`)
}))

router.get('/:id',handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id).populate('reviews');
    if (!restaurants) {
        req.flash('error', 'Cannot Find That Restaurant!');
        res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurants })
}));

router.get('/:id/edit',isLoggedIn, handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);
    if (!restaurants) {
        req.flash('error', 'Cannot Find That Restaurant!');
        res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurants });
}))




router.put('/:id',isLoggedIn, validateRestaurant, handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndUpdate(id, {
        ...req.body.restaurant
    })
    req.flash('success', 'Succesfully Updated!')

    res.redirect(`/restaurants/${restaurants._id}`)
}))

router.delete('/:id',isLoggedIn, handleAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Restaurant!')
    res.redirect('/restaurants');
}));


module.exports = router;
