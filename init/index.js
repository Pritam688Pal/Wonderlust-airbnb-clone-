const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");
const listing = require("../models/listing.js");

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}

main()
    .then(()=>console.log("Connected to db"))
    .catch((err)=>console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialized");
}

initDB();