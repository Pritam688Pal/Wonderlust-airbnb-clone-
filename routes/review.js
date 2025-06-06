const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const expressError = require("../utils/expressError.js");
const { reviewSchima } = require("../schima.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js"); //schema

const validateReview = (req,res,next) => {
    let {error} = reviewSchima.validate(req.body);
    console.log(error);
    if (error) {
        throw new expressError(400, error.details.map(e => e.message).join(", "));
    } else {
        next();
    }
}

//Reviews
//post route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = await review(req.body.review);
    //console.log(Listing);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("Success","New Revew created.");
    res.redirect(`/listings/${Listing.id}`);
}));

//delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let { id,reviewId } = req.params;
    await await listing.findByIdAndUpdate(id,{$pull: { reviews:reviewId }});
    await review.findByIdAndDelete(reviewId);
    req.flash("Success","Review deleted.");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;