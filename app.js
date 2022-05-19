
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const {restaurantSchema} = require('./schemas');
const handleAsync = require('./Utility/handleAsync');
const ExpressError = require('./Utility/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Restaurant = require('./models/restaurant');

// problem with ejs-mate

mongoose.connect('mongodb://localhost:27017/yelp-restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const serverValidation = (req,res,next) =>{
    const {error} = restaurantSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.send('Hello GUYS');
})


app.get('/restaurants', handleAsync(async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
}))

app.get('/restaurants/new', (req, res) => {

    res.render('restaurants/new')
})

app.post('/restaurants',serverValidation, handleAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Hey Invalid Data', 400)
    const restaurants = new Restaurant(req.body.restaurant);
    await restaurants.save();
    res.redirect(`/restaurants/${restaurants._id}`)
}))

app.get('/restaurants/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);
    res.render('restaurants/show', { restaurants })
}));

app.get('/restaurants/:id/edit', handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);

    res.render('restaurants/edit', { restaurants });
}))


app.put('/restaurants/:id',serverValidation ,handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndUpdate(id, {
        ...req.body.restaurant
    })
    res.redirect(`/restaurants/${restaurants._id}`)
}))

app.delete('/restaurants/:id', handleAsync(async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));

app.all(('*'), (req, res, next) => {
    next(new ExpressError('This page does not exist', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening ON Port 3000!!");
})
