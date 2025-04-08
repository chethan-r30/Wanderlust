const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
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
const Listing = require("../wanderlust/models/listing.js");

app.get("/", (req, res) => {
    res.send("hi i am root");
});

const validateListing =(req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
   throw new ExpressError(400,error);
  }else{
    next();
  }
};

//index route

app.get("/listings",validateListing, wrapAsync(async (req,res)=>{
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs",{alllistings});
}));

// new route
app.get("/listings/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});

//create roiute

app.post("/listings", wrapAsync(async(req,res,next)=>{
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
   const listing =await Listing.findById(id);
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

