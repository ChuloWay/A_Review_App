const Joi = require('joi');
const joi = require('joi');

module.exports.restaurantSchema =  joi.object({
    restaurant: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        // image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})