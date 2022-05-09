const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;


const RestaurantSchema = new Schema({
    title: String,
    image:String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);