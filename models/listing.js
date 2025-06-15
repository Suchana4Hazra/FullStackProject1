const mongoose = require('mongoose');
const schema = mongoose.Schema;

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
    }
})

//create a model(collection)
const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;