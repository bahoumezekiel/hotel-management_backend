const express = require('express');
const router = express.Router();
const hotelCtrl = require('../controllers/hotelController');
const upload = require('../images/multer.config');


// Route pour créer un nouvel hôtel
router.post('/', upload.single('image'), hotelCtrl.createHotel);

// Route pour récupérer tous les hôtels
router.get('/', hotelCtrl.getAllHotels);

// Route pour récupérer un hôtel par ID
router.get('/:id', hotelCtrl.getHotelById);

// Route pour modifier un hôtel
router.put('/:id', upload.single('image'), hotelCtrl.modifyHotel);

// Route pour supprimer un hôtel
router.delete('/:id', hotelCtrl.deleteHotel);

module.exports = router;