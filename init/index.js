
require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MONGO_URL = process.env.ATLASDB_URL;
const mapToken = process.env.MAP_TOKEN;

async function initDB() {
    if (!MONGO_URL || !mapToken) {
        throw new Error("Missing ATLASDB_URL or MAP_TOKEN in .env");
    }

    const geocodingClient = mbxGeocoding({
        accessToken: mapToken
    });

    await mongoose.connect(MONGO_URL, {
        dbName: "test"
    });

    console.log("Connected to MongoDB Atlas");

    const owner = await User.findOne({
        username: "demo2"
    });

    if (!owner) {
        throw new Error(
            "User demo2 not found in MongoDB Atlas"
        );
    }

    console.log("Using owner:", owner.username);

    let added = 0;
    let skipped = 0;

    for (const obj of initData.data) {
        try {
            const existing = await Listing.findOne({
                title: obj.title,
                location: obj.location
            });

            if (existing) {
                console.log("Already exists:", obj.title);
                skipped++;
                continue;
            }

            const response = await geocodingClient
                .forwardGeocode({
                    query: `${obj.location}, ${obj.country}`,
                    limit: 1
                })
                .send();

            const geometry = response.body.features[0]?.geometry;

            if (!geometry || geometry.type !== "Point") {
                console.log("Location not found:", obj.title);
                skipped++;
                continue;
            }

            const listing = new Listing({
                ...obj,
                owner: owner._id,
                geometry
            });

            await listing.save();

            console.log("Added:", listing.title);
            added++;

        } catch (err) {
            console.error(
                "Failed:", obj.title,
                err.message
            );
            skipped++;
        }
    }

    console.log("-------------------------");
    console.log("Added:", added);
    console.log("Skipped:", skipped);
    console.log("Import completed!");
}

initDB()
    .catch(err => {
        console.error("Import error:", err.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
