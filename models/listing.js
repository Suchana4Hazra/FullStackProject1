const mongoose = require('mongoose');
const schema = mongoose.Schema;
const review = require("./review.js")
//create a schema
const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // image: {
    //     type: String,
    //     default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2ep0GkPoPzPfW2EKsHcHamGx76m6JiIl75ipytzp9TBayvAcgOYCCSjrkGJlG1zyifQ&usqp=CAU",
    //     set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2ep0GkPoPzPfW2EKsHcHamGx76m6JiIl75ipytzp9TBayvAcgOYCCSjrkGJlG1zyifQ&usqp=CAU" : v
    // },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2ep0GkPoPzPfW2EKsHcHamGx76m6JiIl75ipytzp9TBayvAcgOYCCSjrkGJlG1zyifQ&usqp=CAU",
            set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2ep0GkPoPzPfW2EKsHcHamGx76m6JiIl75ipytzp9TBayvAcgOYCCSjrkGJlG1zyifQ&usqp=CAU" : v
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    }
})

//Delete middleware for Reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

//create a model(collection)
const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;