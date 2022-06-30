const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// setting up a schema prop for thumbnail images

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200/h_200')
});

// allows you access virtual schema properties when usng Json Methods-stringify
const opts = { toJSON: { virtuals: true }};

const RestaurantSchema = new Schema({
    title: String,
    images: [
        ImageSchema
    ],
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'

    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
    return`
    <strong><a href = "/restaurants/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p> `
});


RestaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);


