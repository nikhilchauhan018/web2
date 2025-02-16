const express = require('express');
const { addPlant, editPlant, deletePlant, getAllPlants } = require('../controllers/plantController');

const router = express.Router();

router.post('/plants', addPlant);
router.put('/plants/:id', editPlant);
router.delete('/plants/:id', deletePlant);
router.get('/plants', getAllPlants);

module.exports = router;