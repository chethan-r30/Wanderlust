const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title:{type:String ,required:true},
    description:String,
    image:{type:String,default:"https://unsplash.com/photos/a-small-white-building-with-a-red-roof-XHti2_XGjs8",set:(v)=> v===""?"https://unsplash.com/photos/a-small-white-building-with-a-red-roof-XHti2_XGjs8":v},
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("listing",listingschema);
module.exports=Listing;
