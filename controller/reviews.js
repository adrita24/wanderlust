const {Listing}=require("../models/listings.js");
const Review=require("../models/reviews.js");

module.exports.add=async (req, res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review Created!");
    return res.redirect(`/listings/${listing._id}`);
}

module.exports.delete=async (req,res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted!");
    return res.redirect(`/listings/${id}`);
}