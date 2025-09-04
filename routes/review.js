const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controller/reviews.js");

//reviews
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.add));

//delete review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync( reviewController.delete));

module.exports=router;