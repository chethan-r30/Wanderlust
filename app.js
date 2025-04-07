const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
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

//index route

app.get("/listings",async (req,res)=>{
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs",{alllistings});
});

// new route
app.get("/listings/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});

//create roiute

app.post("/listings", async(req,res,next)=>{
  //let{title,description,image,price,location,country}=req.body;
  try{
    let listing = req.body.listing;
    const newListing =new Listing(listing) ;
    await newListing.save();
    res.redirect("/listings");
  }catch(err){
    next(err);
  }
   
});

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
   const listing =await Listing.findById(id);
   res.render("../views/listings/edit.ejs",{listing});
});
//update route
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//show route
app.get("/listings/:id", async (req,res) => {
   let {id} = req.params;
   const listing =await Listing.findById(id);
   res.render("../views/listings/show.ejs",{listing});
});

//delete route
app.delete("/listings/:id", async (req,res) =>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings");
} );
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
app.use((err,req,res,next)=>{
  res.send("Something went wrong!!");
});



app.listen(8080, () => {
    console.log("server is listening to port");
});

