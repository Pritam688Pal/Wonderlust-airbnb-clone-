const Joi = require("joi");
const listing = require("./models/listing");

module.exports =  listingSchima = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        description:Joi.string().allow("",null)
    }).required()
});