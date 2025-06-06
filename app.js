const express = require("express");
const app = express();//express set up
const mongoose = require("mongoose");
const path = require("path"); //to serve other paths which isn't directly accessable
const methodOverride = require("method-override"); //for put,delete req
const ejsMate = require("ejs-mate"); //for partision of ejs files **
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");


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

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

//home route
app.get("/",(req,res) => {
    res.send("Hi,I'm Root.");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("Success");
    res.locals.error = req.flash("error");
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })

app.use("/listings/:id/reviews",review);
app.use("/listings",listings);
app.use("/",user);

// page not found
app.all(/^\/.*/, (req, res, next) => {
    next(new expressError(404,"Page Not Found!"));
});

// err handelig
app.use((err, req, res, next) => {
    //console.log(err);
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).render("err.ejs", {statusCode, message });
});


//listning to port
const port = 8080;
app.listen(port,() => {
    console.log(`listning to port ${port}`);
})