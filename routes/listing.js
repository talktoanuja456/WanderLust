
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isAdmin,
    validateListing
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// View all listings and create listing
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        isAdmin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Listing - Admin only
router.get(
    "/new",
    isLoggedIn,
    isAdmin,
    listingController.renderNewForm
);

// View, update and delete listing
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isAdmin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isAdmin,
        wrapAsync(listingController.destroyListing)
    );

// Edit Listing - Admin only
router.get(
    "/:id/edit",
    isLoggedIn,
    isAdmin,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
