const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

main().then(() =>
    console.log("connected to db"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"686d59a76b8df7e3dd93af63"}))
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
};

initDB();

