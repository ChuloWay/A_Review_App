const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


// this removes tags for html, usefull against XSS
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules : {
        escapeHTML: {
            validate(value,helpers) {
                const clean = sanitizeHtml(value, {
                    // shows that no tags or attribute is allowed
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }

});

const Joi = BaseJoi.extend(extension);

module.exports.restaurantSchema =  Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})