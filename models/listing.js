const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");
const listingschema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-small-white-building-with-a-red-roof-XHti2_XGjs8",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-small-white-building-with-a-red-roof-XHti2_XGjs8"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
//mongoose middleware
listingschema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("listing", listingschema);
module.exports = Listing;
