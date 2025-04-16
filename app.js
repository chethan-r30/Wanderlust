const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Listing = require("../wanderlust/models/listing.js");
const Review = require("../wanderlust/models/review.js");
const mongoose = require("mongoose");
main().then(() =>
    console.log("connected to db"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("hi i am root");
});

const validateListing =(req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = err.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};
const validateReview =(req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = err.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};

//index route

app.get("/listings", wrapAsync(async (req,res)=>{
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs",{alllistings});
}));

// new route
app.get("/listings/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});


//create roiute
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
  //let{title,description,image,price,location,country}=req.body;
  
    let listing = req.body.listing;
    const newListing =new Listing(listing) ;
   
    await newListing.save();
    res.redirect("/listings");
   
})
);

//edit route
app.get("/listings/:id/edit", wrapAsync( async (req,res)=>{
    let {id} = req.params;
   const listing =await Listing.findById(id);
   res.render("../views/listings/edit.ejs",{listing});
}));


//update route
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//show route
app.get("/listings/:id",wrapAsync( async (req,res) => {
   let {id} = req.params;
   const listing =await Listing.findById(id).populate("reviews");
   res.render("../views/listings/show.ejs",{listing});
})
);

//delete route
app.delete("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings");})
 );

//reviews post route

app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{     //validateReview is a middleware for the validation and wrapasyc is used for error handling
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
app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
  let{id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

// app.get("/testlistings",async (req,res)=>{
//     let samplelisting =new Listing({
//         title:"chandu Villa",
//         description:"by the beach",
//         price:"1200",
//         location:"calangute, goa",
//         country:"india",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send ("successful testing");
// });

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});


app.use((err,req,res,next)=>{
  let{statusCode = 500,message="something went wrong"}= err;   //default values
  //res.send("Something went wrong!!");
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});



app.listen(8080, () => {
    console.log("server is listening to port");
});

