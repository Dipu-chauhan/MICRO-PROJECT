const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },

    description: String,

    // image:{
    //     default: "file:///C:/Users/Dipu%20chauhan/Downloads/georgi-kalaydzhiev-WaxPv3S-EXM-unsplash.jpg",
    //     type: String,
    //     filename: 'listingimage',
    //     url: 'file:///C:/Users/Dipu%20chauhan/Downloads/georgi-kalaydzhiev-WaxPv3S-EXM-unsplash.jpg',
    //     set:(v) => v === ""?"file:///C:/Users/Dipu%20chauhan/Downloads/georgi-kalaydzhiev-WaxPv3S-EXM-unsplash.jpg":v,
    // },
    image: {
        filename: String,
        url: String
    },

    price: {
    type: Number,
},

    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;