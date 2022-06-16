
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const { restaurantSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./Utility/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');



const Restaurant = require('./models/restaurant');
const Review = require('./models/review');

// Routes Imported
const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');
const { getMaxListeners } = require('process');


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

const sessionConfig = {
    secret: 'topsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser);


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




app.use('/restaurants', restaurants)
app.use('/restaurants/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.send('Hello GUYS');
})

app.get('/test', async (req, res) => {
    const user = new User({ email: 'buka@gmail.com', username: 'buka' });
    const newUser = await User.register(user, 'bukadon');
    res.send(newUser);
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
