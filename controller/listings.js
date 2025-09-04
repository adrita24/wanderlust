const { Listing, categories } = require("../models/listings");

module.exports.index=async (req,res)=>{
    let query = req.query.q || ""; // default to empty if no search
    let allListings;

  if (query) {
    allListings = await Listing.find({
      country: { $regex: query, $options: "i" } // case-insensitive
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, query });
}

module.exports.new=(req,res)=>{
    return res.render("listings/new.ejs",{categories});
}

module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate:"author"}).populate("owner");
    if(!listing){
        req.flash("error","Listing requested does not exist");
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs",{listing});
}

module.exports.create=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url, filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        return res.redirect("/listings");
}

module.exports.edit= async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing requested does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250");
    return res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.update=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof(req.file)!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }
    req.flash("success","Listing Edited!");
    return res.redirect(`/listings/${id}`);
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    return res.redirect("/listings");
}

module.exports.filter=async(req,res)=>{
    let query = req.query.q || "";
    let {category}=req.params;
    let filteredListings=await Listing.find({category: `${category}`});
    return res.render("listings/filtered.ejs",{filteredListings, query});
}