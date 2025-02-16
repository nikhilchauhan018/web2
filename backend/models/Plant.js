
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number, 
  image: String,  
});

module.exports = mongoose.model('Plant', plantSchema);
