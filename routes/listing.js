const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConflict.js");
const upload = multer({ storage });

const listingController=require("../controller/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing, upload.single('listing[image]'), wrapAsync(listingController.create));

router.get("/new", isLoggedIn, listingController.new);

router.get("/filter/:category", wrapAsync(listingController.filter));

router.route("/:id")
.get( wrapAsync(listingController.show))
.put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), wrapAsync(listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports=router;