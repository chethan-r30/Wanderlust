const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing =(req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = err.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};

//index route
router.get("/", wrapAsync(async (req,res)=>{
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs",{alllistings});
}));

// new route
router.get("/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});


//create roiute
router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
  //let{title,description,image,price,location,country}=req.body;
    let listing = req.body.listing;
    const newListing =new Listing(listing) ; 
    await newListing.save();
    res.redirect("/listings");
})
);

//edit route
router.get("/:id/edit", wrapAsync( async (req,res)=>{
    let {id} = req.params;
   const listing =await Listing.findById(id);
   res.render("../views/listings/edit.ejs",{listing});
}));


//update route
router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//show route
router.get("/:id",wrapAsync( async (req,res) => {
   let {id} = req.params;
   const listing =await Listing.findById(id).populate("reviews");
   res.render("../views/listings/show.ejs",{listing});
})
);

//delete route
router.delete("/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings");})
 );

 module.exports=router;