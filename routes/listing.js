const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const{storage} = require("../cloudConfig.js");
const upload = multer({ storage });


const listingController = require("../controllers/listings.js");

//index route && create route
router.route("/")
   .get( wrapAsync(listingController.index))
   .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));
   

// new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
     .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))//update route
     .get(wrapAsync( listingController.showListing))//show route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));//delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;