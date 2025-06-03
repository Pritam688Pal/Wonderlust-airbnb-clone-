const express = require("express");
const app = express();//express set up
const mongoose = require("mongoose");
const listing = require("./models/listing.js"); //schema
const path = require("path"); //to serve other paths which isn't directly accessable
const methodOverride = require("method-override"); //for put,delete req
const ejsMate = require("ejs-mate"); //for partision of ejs files **
const wrapAsync = require("./utils/wrapAsyc.js");
const expressError = require("./utils/expressError.js");
const listingSchima = require("./schima.js");


app.set("view engine","ejs"); //to decode ejs files
app.set("views",path.join(__dirname,"views")); //to access ejs file in views directory
app.engine('ejs', ejsMate); //for partision of ejs files **
app.use(express.static(path.join(__dirname,"/public"))); //to access files in public folder in the same directory
app.use(express.urlencoded({extended: true})); //for post req body parsing
app.use(methodOverride("_method")); //for put,delete req

//db connections
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}
main()
    .then(()=>console.log("Connected to db"))
    .catch((err)=>console.log(err));

//home route
app.get("/",(req,res) => {
    res.send("Hi,I'm Root.");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchima.validate(req.body);
    // console.log(error);
    if (error) {
        throw new expressError(error,400);
    } else {
        next();
    }
}

//Index route
app.get("/listings", wrapAsync(async(req,res) => {
    // const allListings = await listing.find({});
    res.render("./listings/index.ejs",{ allListings:  await listing.find({})});
    
}));

//new route
app.get("/listings/new",wrapAsync((req,res) => {
    res.render("listings/new.ejs");
}));

//show route
app.get("/listings/:id",wrapAsync(async(req,res) => {
    let { id } = req.params;
    const e = await listing.findById(id);
    res.render("./listings/show.ejs",{ e });
}));

//create route
app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
    const newlisting = new listing(req.body.listing);   
    await newlisting.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const e = await listing.findById(id);
    await res.render("./listings/edit.ejs",{ e });
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// page not found
app.all('/*path', (req, res, next) => {
    next(new expressError("Page Not Found!", 404));
    // res.send("wildcard")
});

// err handelig
app.use((err,req,res,next)=>{
    res.status(err.statusCode).render("err.ejs",{ err });
});

//listning to port
const port = 8080;
app.listen(port,() => {
    console.log(`listning to port ${port}`);
})