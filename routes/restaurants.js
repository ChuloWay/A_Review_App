const express = require('express');
const router = express.Router();
const handleAsync = require('../Utility/handleAsync');
const { restaurantSchema } = require('../schemas');

const ExpressError = require('../Utility/ExpressError');
const Restaurant = require('../models/restaurant');


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


router.get('/new', (req, res) => {

    res.render('restaurants/new')
})

router.post('/', validateRestaurant, handleAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Hey Invalid Data', 400)
    const restaurants = new Restaurant(req.body.restaurant);
    await restaurants.save();
    res.redirect(`/restaurants/${restaurants._id}`)
}))

router.get('/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id).populate('reviews');
    res.render('restaurants/show', { restaurants })
}));

router.get('/:id/edit', handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);

    res.render('restaurants/edit', { restaurants });
}))



router.put('/:id', validateRestaurant, handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndUpdate(id, {
        ...req.body.restaurant
    })
    res.redirect(`/restaurants/${restaurants._id}`)
}))

router.delete('/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));


module.exports = router;
