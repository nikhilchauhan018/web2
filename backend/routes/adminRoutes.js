const express = require('express');
const { adminSignup, adminLogin, uploadImage, getAllImages, upload } = require('../controllers/adminController');
const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/upload', upload.single('image'), uploadImage);
router.get('/images', getAllImages);

module.exports = router;