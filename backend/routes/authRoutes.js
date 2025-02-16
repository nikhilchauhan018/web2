const express = require('express');
const { userSignup, userLogin } = require('../controllers/userController');
const auth = require('../middleware/autho');
const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);


router.get('/profile', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;