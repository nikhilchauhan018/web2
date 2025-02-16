const Donation = require('../models/Donation');
const Plant = require('../models/Plant');
const qrcode = require('qrcode');


exports.donate = async (req, res) => {
  const { userId, amount, plantId } = req.body;

  try {
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: 'usd',
      description: `Donation for Plant ID: ${plantId}`,
    });

    
    const donation = new Donation({ userId, amount, plantId });
    await donation.save();

   
    const qrCode = await qrcode.toDataURL(`http://localhost:3000/dashboard/${donation._id}`);

    res.status(201).json({ message: 'Donation successful', paymentIntent, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};