
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
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


app.get('/', (req, res) => {
    res.send('Hello GUYS');
})


app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
})

app.get('/restaurants/new', (req, res) => {

    res.render('restaurants/new')
})

app.post('/restaurants', async (req, res) => {
    const restaurants = new Restaurant(req.body.restaurant);
    await restaurants.save();
    res.redirect(`/restaurants/${restaurants._id}`)
})

app.get('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);
    res.render('restaurants/show', { restaurants })
})

app.get('/restaurants/:id/edit', async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(req.params.id);

    res.render('restaurants/edit', { restaurants });
})


app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndUpdate(id, {
        ...req.body.restaurant
    })
    res.redirect(`/restaurants/${restaurants._id}`)
})

app.delete('/restaurants/:id', async(req,res)=>{
    const {id} = req.params;
    const restaurants = await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
});

app.listen(3000, () => {
    console.log("Listening ON Port 3000!!");
})
