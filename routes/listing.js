const express = require('express');
const router = express.Router();
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../Controller/listing.js");
const multer = require("multer");
const { cloudinary } = require("../cloudConfig.js");

const { geocodeAddress } = require("../geocodingConfig.js"); // Add this import

// Use memory storage - files will be stored in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
    .route("/")
    .get(ListingController.index)
    .post(isLoggedIn, validateListing, upload.single('listing[image][url]'), async (req, res) => {
        try {
            console.log('Form data:', req.body);
            console.log('File received:', req.file);
            
            let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2ep0GkPoPzPfW2EKsHcHamGx76m6JiIl75ipytzp9TBayvAcgOYCCSjrkGJlG1zyifQ&usqp=CAU"; // default image
            let filename = "";

            // Upload image to cloudinary if file is provided
            if (req.file) {
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'StayTogether_DEV',
                        },
                        (error, result) => {
                            if (error) {
                                console.error('Cloudinary error:', error);
                                reject(error);
                            } else {
                                console.log('Upload successful:', result);
                                resolve(result);
                            }
                        }
                    );
                    
                    // Send the buffer to cloudinary
                    uploadStream.end(req.file.buffer);
                });

                imageUrl = uploadResult.secure_url;
                filename = uploadResult.public_id;
            }

            // Geocode the location (optional - add coordinates)
            let geometry = null;
            try {
                const geoData = await geocodeAddress(req.body.listing.location, req.body.listing.country);
                geometry = {
                    type: "Point",
                    coordinates: geoData.coordinates
                };
                console.log('Location geocoded:', geoData);
            } catch (geoError) {
                console.log('Geocoding failed, continuing without coordinates:', geoError.message);
            }

            // Create the listing object
            const newListing = {
                title: req.body.listing.title,
                description: req.body.listing.description,
                price: req.body.listing.price,
                location: req.body.listing.location,
                country: req.body.listing.country,
                image: {
                    filename: filename,
                    url: imageUrl
                },
                geometry: geometry, // Add coordinates if geocoding succeeded
                owner: req.user._id
            };

            // Save to database using your controller
            const Listing = require("../models/listing.js"); // Import your model
            const listing = new Listing(newListing);
            await listing.save();

            req.flash('success', 'New listing created successfully!');
            res.redirect('/listings');

        } catch (error) {
            console.error('Error creating listing:', error);
            req.flash('error', 'Failed to create listing. Please try again.');
            res.redirect('/listings/new');
        }
    });

// New route - PUT THIS BEFORE /:id route
router.get('/new', isLoggedIn, ListingController.newListing);

router
   .route("/:id")
   .get(ListingController.showListing)
   .put(isLoggedIn, isOwner, validateListing, upload.single('listing[image][url]'), async (req, res) => {
        try {
            console.log('Edit form data:', req.body);
            console.log('Edit file received:', req.file);
            
            const { id } = req.params;
            const Listing = require("../models/listing.js");
            
            // Find the existing listing
            let listing = await Listing.findById(id);
            if (!listing) {
                req.flash('error', 'Listing not found!');
                return res.redirect('/listings');
            }

            // Keep existing image info by default
            let imageUrl = listing.image.url;
            let filename = listing.image.filename;

            // Upload new image to cloudinary if file is provided
            if (req.file) {
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'StayTogether_DEV',
                        },
                        (error, result) => {
                            if (error) {
                                console.error('Cloudinary error:', error);
                                reject(error);
                            } else {
                                console.log('Upload successful:', result);
                                resolve(result);
                            }
                        }
                    );
                    
                    // Send the buffer to cloudinary
                    uploadStream.end(req.file.buffer);
                });

                // Delete old image from cloudinary if it exists and is not the default
                if (listing.image.filename && listing.image.filename !== "") {
                    try {
                        await cloudinary.uploader.destroy(listing.image.filename);
                        console.log('Old image deleted from cloudinary');
                    } catch (deleteError) {
                        console.log('Error deleting old image:', deleteError);
                    }
                }

                imageUrl = uploadResult.secure_url;
                filename = uploadResult.public_id;
            }

            // Update the listing with new data
            const updatedData = {
                title: req.body.listing.title,
                description: req.body.listing.description,
                price: req.body.listing.price,
                location: req.body.listing.location,
                country: req.body.listing.country,
                image: {
                    filename: filename,
                    url: imageUrl
                }
            };

            listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
            
            req.flash('success', 'Listing updated successfully!');
            res.redirect(`/listings/${id}`);

        } catch (error) {
            console.error('Error updating listing:', error);
            req.flash('error', 'Failed to update listing. Please try again.');
            res.redirect(`/listings/${req.params.id}/edit`);
        }
   })
   .delete(isLoggedIn, isOwner, async (req, res) => {
        try {
            const { id } = req.params;
            const Listing = require("../models/listing.js");
            
            // Find the listing to get image info before deleting
            const listing = await Listing.findById(id);
            if (listing && listing.image.filename && listing.image.filename !== "") {
                try {
                    await cloudinary.uploader.destroy(listing.image.filename);
                    console.log('Image deleted from cloudinary');
                } catch (deleteError) {
                    console.log('Error deleting image from cloudinary:', deleteError);
                }
            }

            // Delete the listing from database
            await Listing.findByIdAndDelete(id);
            
            req.flash('success', 'Listing deleted successfully!');
            res.redirect('/listings');

        } catch (error) {
            console.error('Error deleting listing:', error);
            req.flash('error', 'Failed to delete listing. Please try again.');
            res.redirect('/listings');
        }
   });

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.editListingForm);

module.exports = router;