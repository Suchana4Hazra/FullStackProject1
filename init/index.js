const mongoose = require("mongoose");
const iniData = require("./data.js");
const listing = require("../models/listing.js")


connectDatabase()
.then(() => {
    console.log("Connected to Database")
})
.catch(() => {
    console.log("Database connection Error!");
})

//connect mongoDB
async function connectDatabase () {
    await mongoose.connect('mongodb://localhost:27017/StayTogether');
}

const initDB = async () => {
    await listing.deleteMany({}); //delete all prev entries
    await listing.insertMany(iniData.data);
    // console.log(iniData.data);
    console.log("Database is initialized successfully");
}

initDB();