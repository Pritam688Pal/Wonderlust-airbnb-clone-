const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js"); //schema
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchima } = require("../schima.js");
const expressError = require("../utils/expressError.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchima.validate(req.body);
    //console.log(error);
    if (error) {
        throw new expressError(400, error.details.map(e => e.message).join(", "));
    } else {
        next();
    }
}

//Index route
router.get("/", wrapAsync(async(req,res) => {
    // const allListings = await listing.find({});
    res.render("./listings/index.ejs",{ allListings:  await listing.find({})});
    
}));

//new route
router.get("/new",wrapAsync(async(req,res) => {
    res.render("./listings/new.ejs");
}));

//show route
router.get("/:id",wrapAsync(async(req,res) => {
    let { id } = req.params;
    const e = await listing.findById(id).populate("reviews");
    if (!e) {
        req.flash("error","Requested Listing doesn't exist!");
        res.redirect("/listings")
    }
    else {
        res.render("./listings/show.ejs",{ e });
    }
}));

//create route
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    const newlisting = new listing(req.body.listing);   
    await newlisting.save();
    req.flash("Success","New Listing created.");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const e = await listing.findById(id);
    res.render("./listings/edit.ejs",{ e });
}));

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("Success","Listing Updated.");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("Success","Listing deleted.");
    res.redirect("/listings");
}));

module.exports = router;