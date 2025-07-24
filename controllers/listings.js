const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });


module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("../views/listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("../views/listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  //let{title,description,image,price,location,country}=req.body;
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listings");
  }
  res.render("../views/listings/show.ejs", { listing });
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250");
  res.render("../views/listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
