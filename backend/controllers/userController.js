const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSignup = async (req, res) => {
  const { email, password, phone } = req.body;
  try {
    console.log('Signup request received:', { email, password, phone });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, phone });
    await user.save();
    console.log('User saved:', user); // Log the saved user
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup failed:', err);
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login request received:', { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT Secret is not configured');
      return res.status(500).json({ error: 'JWT Secret is not configured' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};

module.exports = {
  userSignup,
  userLogin,
};