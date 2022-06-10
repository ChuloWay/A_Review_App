
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const { restaurantSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./Utility/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Restaurant = require('./models/restaurant');
const Review = require('./models/review');

// Routes Imported
const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');


// problem with ejs-mate

mongoose.connect('mongodb://localhost:27017/yelp-restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
app.use(express.static(path.join(__dirname, 'public')));



app.use('/restaurants', restaurants)
app.use('/restaurants/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.send('Hello GUYS');
})






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
