const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")

const PORT = 3000;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(methodOverride("_method"))

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

app.get("/", (req, res) => {
    console.log("root");
    res.send("Welcome to StayTogether!");
})

//Index Route
app.get('/listings', async (req, res) => {
    console.log("list")
    const allListing = await listing.find({});
    res.render("./listings/index.ejs", { allListing });
})

//new route
app.get('/listings/new', (req, res) => {
    console.log("new listing");
    res.render('./listings/new.ejs');
})

// //Edit route
// app.get("listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     console.log("edit api")
//     const Listing = await listing.findById(id);
//     res.render("./listings/edit.ejs", { Listing });
// })

//show route
app.get("/listings/:id", async (req, res) => {
    console.log("show a particular listing")
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("./listings/show.ejs", { Listing });
})

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    console.log("edit api")
    const Listing = await listing.findById(id);
    res.render("./listings/edit.ejs", { Listing });
})

app.put("/listings/:id", async (req,res) => {
     let { id } = req.params;
     await listing.findByIdAndUpdate(id, {...req.body})
     res.redirect(`/listings/${id}`);
})

//create route
app.post("/listings", async (req, res) => {
    // console.log(req.body);
    const newListing = new listing(req.body);
    newListing.save();
    res.redirect("/listings");
})

//Delete route
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})

// //Edit route
// app.get("listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const Listing = await listing.findById(id);
//     res.render("./listings/edit.ejs", { Listing });
// })

//For testing
app.get("/testListing", async (req, res) => {
    let sampleListing = new listing({
        title: "my new home",
        description: "Near the hill",
        price: 1400,
        location: "Risikesh",
        country: "India"
    });

    await sampleListing.save();
    console.log("Data is saved successfully");
    res.send("success");
})

connectToDatabase().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Connect to MongoDB
async function connectToDatabase() {
    await mongoose.connect('mongodb://localhost:27017/StayTogether');
}

