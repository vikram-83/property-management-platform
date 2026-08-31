// controllers/amenityController.js
const Amenity = require('../models/Amenity');

// Get all amenities
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    res.status(200).json(amenities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching amenities', error: error.message });
  }
};

// Create a new amenity
exports.createAmenity = async (req, res) => {
  try {
    const { name, icon, description, isAvailable } = req.body;
    const newAmenity = new Amenity({ name, icon, description, isAvailable });
    await newAmenity.save();
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating amenity', error: error.message });
  }
};