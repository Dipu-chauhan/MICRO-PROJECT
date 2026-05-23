const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const { render } = require("ejs");
const {listingSchema} = require("./schema.js");
const ExpreeError = require("./utils/ExpressError");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connect to DB")
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res) => {
    res.send("Hi I'm root");
});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpreeError(400,result.error);
    }
    else{
        next();
    }
}
    //! index route

app.get("/listings", wrapAsync(async(req, res) => { 
    Listing.find({}).then((allListings) => {
        // Render index.ejs with the fetched listings
        res.render("listings", { allListings: allListings });
    });
}));

//! new Route

app.get("/listings/new", wrapAsync(async(req,res) => {
    res.render("listings/new.ejs");
}));

//! show Route

app.get("/listings/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
}));

//! Create Route
app.post("/listings",validateListing,
    wrapAsync(async(req,res,next) =>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpreeError(400,result.error);
    }
    // let{title,description,image,price , country , location} =req.body;
    // if(!req.body.listing) {
    //     throw new ExpressError(404,"send vaild data  for listing")
    // }

        const newListing = new Listing(req.body);


    await newListing.save();
    res.redirect("/listings");
    
})
);

///! Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//! update route
// app.put("/listings/:id", async (req, res) => {
//     let { id } = req.params;

//     await Listing.findByIdAndUpdate(id, { ...req.body });

//     res.redirect(`/listings/${id}`);
// });

app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(404,"send vaild data  for listing")
    // }
    // let { id } = req.params;

    // let updatedData = { ...req.body };

    // 🔥 image ko object me convert karo
    if (req.body.image) {
        updatedData.image = {
            filename: "listingimage",
            url: req.body.image
        };
    }
    await Listing.findByIdAndUpdate(id, updatedData);

    res.redirect(`/listings/${id}`);
}));

//! Delete route
app.delete("/listings/:id", wrapAsync(async(req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));
// app.get("/testListing",async(req,res) => {

//     let sampleListing = new Listing ({
//         title : "my new villa ",
//         description :"By the beach",
//         price:1200,
//         location:"calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});

app.use((err,req,res,next)=>{
let{statusCode = 500,message = "something went wrong"} = err;
res.render("error.ejs",{err});
//res.status(statusCode).send(message);
});

app.listen(8080,() =>{
    console.log("server is listening to port 8080");
});