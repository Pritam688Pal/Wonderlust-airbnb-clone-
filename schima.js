const Joi = require("joi");

let listingSchima = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        description:Joi.string().allow("",null)
    }).required()
});

let reviewSchima = Joi.object({
    review: Joi.object({
        rating:  Joi.number().required().max(5).min(1),
        comment: Joi.string().required()
    }).required(),
});

module.exports = {
    listingSchima,
    reviewSchima
};