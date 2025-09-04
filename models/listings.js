const mongoose=require("mongoose");
const Review = require("./reviews");
const User = require("./users");
const { required } = require("joi");
const schema=mongoose.Schema;

const categories = [
  "mountains",
  "rooms",
  "castles",
  "amazing pools",
  "boats",
  "camping"
];

const listingSchema=new schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image:{
        type: {
        filename: String,
        url: String,},
        set:(v)=>v===""?"https://i0.wp.com/picjumbo.com/wp-content/uploads/calming-evening-nature-scenery-free-image.jpeg?w=600&quality=80":v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    category:{
        type: String,
        enum: categories,
        required: true,
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing", listingSchema);
module.exports={Listing, categories};