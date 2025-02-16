const Plant = require('../models/Plant');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('image');


exports.addPlant = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const { name, price, description } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      const plant = new Plant({ name, price, description, image });
      await plant.save();
      res.status(201).json({ message: 'Plant added successfully', plant });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

exports.editPlant = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const plant = await Plant.findByIdAndUpdate(id, { name, price, description }, { new: true });
    res.json({ message: 'Plant updated successfully', plant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deletePlant = async (req, res) => {
  const { id } = req.params;

  try {
    await Plant.findByIdAndDelete(id);
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};