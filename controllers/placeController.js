const asyncHandler = require("express-async-handler");
const Place = require("../models/placesModel");
const Event = require("../models/eventsModel");
const cloudinary = require("cloudinary");

// GET /places
const getAllPlaces = asyncHandler(async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /places/:id
const getPlacesById = async (req, res) => {
  const placeId = req.params.id;

  try {
    const place = await Place.findById(placeId);
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ error: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /places
const createPlace = async (req, res) => {
  try {
    const { name, category, priceRange } = req.body;
    const image = req.file;

    //Store the uploaded image on cloudinary
    const result = await cloudinary.uploader.upload(image.path);

    const image_url = result.secure_url;
    console.log(image_url);
    //Store the uploaded info on db
    const place = await Place.create({
      name,
      category,
      priceRange,
      image: image_url,
    });

    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /places/:id
const updatePlace = async (req, res) => {
  const placeId = req.params.id;
  const { name } = req.body;

  try {
    const place = await Place.findByIdAndUpdate(
      placeId,
      { name },
      { new: true }
    );
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ error: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /places/:id
const deletePlace = async (req, res) => {
  const placeId = req.params.id;

  try {
    const place = await Place.findByIdAndDelete(placeId);
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ error: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const handleHome = async (req, res) => {
  const places = await Place.find();
  const events = await Event.find();
  const explore = [];
  const event = [];
  for (i of places) {
    explore.push(i.image);
  }
  for (i of events) {
    event.push(i.photo);
  }
  try {
    res.json({
      explore: explore,
      event: event,
      fav: explore[3],
    });
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports = {
  getAllPlaces,
  getPlacesById,
  createPlace,
  updatePlace,
  deletePlace,
  handleHome,
};
