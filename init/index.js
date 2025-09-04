const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const MongoURL='mongodb://127.0.0.1:27017/wanderlust';

main().then( () => {
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MongoURL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"68acd0bcc68497cb022506db"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
};

initDB();