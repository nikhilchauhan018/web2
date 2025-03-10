const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes); 

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));