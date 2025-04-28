const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview =(req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = err.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};

//reviews post route
router.post("/", validateReview,wrapAsync(async(req,res)=>{     //validateReview is a middleware for the validation and wrapasyc is used for error handling
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
await newReview.save();
await listing.save();
// console.log("new review saved");
// res.send("new review saved");
 res.redirect(`/listings/${listing._id}`);
}));

// review delete route
router.delete("/:reviewId",wrapAsync( async(req,res)=>{
  let{id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;