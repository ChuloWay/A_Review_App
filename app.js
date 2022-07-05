if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
};


const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const { restaurantSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./Utility/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');


const restaurant = require('./models/restaurant');
const Review = require('./models/review');

// Routes Imported
const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongo');

const dbUrl =  'mongodb://localhost:27017/yelp-restaurant'

mongoose.connect(dbUrl, {
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

// help stops mongo Injection by stopping specific characters from being recognised
app.use(mongoSanitize());


// const store = new MongoStore({
//     url: dbUrl,
//     secret: 'topsecret',
//     touchAfter: 24 * 60 * 60
// });
// store.on("error",function(err){
//     console.log("Session Error", err);
// });

const secret = process.env.SECRET || 'topsecret'

const sessionConfig = {
    store: MongoStore.create({
         mongoUrl: dbUrl,
         touchAfter: 24 * 60 * 60
        }),
    name: 'chulo',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // allows so it can only be accesible through http and not js scripts
        httpOnly: true,
        // secure is not accesible on localhost, only on deployment.
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};


app.use(session(sessionConfig));


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    "https://cdn.jsdelivr.net",
];
const fontSrcUrls = [];

app.use(
    helmet.
    contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: [ "'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/chuloway/",
                "https://media.istockphoto.com/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    if (!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', userRoutes)
app.use('/restaurants', restaurantRoutes)
app.use('/restaurants/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('restaurants/home');
})






app.all(('*'), (req, res, next) => {
    next(new ExpressError('This page does not exist', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err })
    next()
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening ON Port ${port}!!`);
})
