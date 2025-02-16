const Admin = require('../models/Admin');
const Image = require('../models/Image');
const Donation = require('../models/Donation'); // Assuming you have a Donation model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Plant = require('../models/Plant');
require('dotenv').config(); // Ensure environment variables are loaded

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Get all plants
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching plants: ' + err.message });
  }
};

// Admin Signup
const adminSignup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT Secret is not configured' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};

// Upload Image
const uploadImage = async (req, res) => {
  try {
    const { description } = req.body;
    const imagePath = req.file.path;

    const image = new Image({ description, path: imagePath });
    await image.save();
    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    res.status(500).json({ error: 'Error saving image: ' + err.message });
  }
};

// Get all images
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching images: ' + err.message });
  }
};

// Get all donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching donations: ' + err.message });
  }
};

// Add Plant
const addPlant = async (req, res) => {
  const { name, description, imageUrl } = req.body;
  try {
    const plant = new Plant({ name, description, imageUrl });
    await plant.save();
    res.status(201).json({ message: 'Plant added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding plant: ' + err.message });
  }
};

// Edit Plant
const editPlant = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl } = req.body;
  try {
    const plant = await Plant.findByIdAndUpdate(id, { name, description, imageUrl }, { new: true });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.status(200).json({ message: 'Plant updated successfully', plant });
  } catch (err) {
    res.status(500).json({ error: 'Error updating plant: ' + err.message });
  }
};

// Delete Plant
const deletePlant = async (req, res) => {
  const { id } = req.params;
  try {
    const plant = await Plant.findByIdAndDelete(id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting plant: ' + err.message });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
  uploadImage,
  getAllImages,
  getAllDonations,
  addPlant,
  editPlant,
  deletePlant,
  getAllPlants,
  upload,
};