const mongoose = require("mongoose");
const { type } = require("../schima");
const Schema = mongoose.Schema;
const review = require("./review.js");


const listingSchema =  new Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    image:String,
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
            
        }
    ]
});

listingSchema.post("findByIdAndDelete",async (listing) => {
    await review.deleteMany({_id: { $in: listing.reviews }})
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;