const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("../views/listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
  //let{title,description,image,price,location,country}=req.body;
    let listing = req.body.listing;
    const newListing =new Listing(listing) ; 
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.showListing = async (req,res) => {
   let {id} = req.params;
   const listing =await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for doesn't exist!");
    res.redirect("/listings");
   }
   res.render("../views/listings/show.ejs",{listing});
}
module.exports.renderEditForm =async (req,res)=>{
    let {id} = req.params;
   const listing =await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested for doesn't exist!");
    res.redirect("/listings");
   }
   res.render("../views/listings/edit.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success"," Listing Updated!");
   res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   req.flash("success","Listing Deleted!");
   res.redirect("/listings");
};