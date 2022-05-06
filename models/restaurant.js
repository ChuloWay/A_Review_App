const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;


const RestaurantSchema = new Schema({
    title: String,
    price: String,
    decription: String,
    location: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);