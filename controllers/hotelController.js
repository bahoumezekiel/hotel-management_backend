const Hotel = require('../models/Hotel');
const fs = require('fs');

// Créer un nouvel hôtel
exports.createHotel = async (req, res, next) => {
  try {
    const { name, description, ville} = req.body;
    
    // Vérifier si tous les champs requis sont présents
    if (!name || !description || !ville) {
      return res.status(400).json({
        success: false,
        message: 'Le nom  la description et la ville sont requis'
      });
    }

    // Vérifier si une image a été uploadée
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Une image est requise'
      });
    }

    const hotel = new Hotel({
      name: name,
      description: description,
      ville:ville,
      imageUrl: req.file.path // URL de Cloudinary
    });

    await hotel.save();
    
    res.status(201).json({
      success: true,
      message: 'Hôtel créé avec succès!',
      hotel: hotel
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'hôtel',
      error: error.message
    });
  }
};

// Récupérer tous les hôtels
exports.getAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      hotels: hotels
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des hôtels',
      error: error.message
    });
  }
};

// Récupérer un hôtel par ID
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      hotel: hotel
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'hôtel',
      error: error.message
    });
  }
};

// Modifier un hôtel
exports.modifyHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
    }

    let hotelObject;
    if (req.file) {
      // Supprimer l'ancienne image
      if (hotel.imageUrl) {
        const oldImagePath = hotel.imageUrl.replace(/^.*\/images\//, '');
        fs.unlink(`images/${oldImagePath}`, (err) => {
          if (err) console.error('Erreur suppression ancienne image:', err);
        });
      }
      hotelObject = { ...req.body, imageUrl: req.file.path };
    } else {
      hotelObject = { ...req.body };
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { ...hotelObject, _id: req.params.id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Hôtel modifié avec succès!',
      hotel: updatedHotel
    });
  } catch (error) {
    console.error('Erreur modification hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
};


// Supprimer un hôtel
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
    }

    // Supprimer l'image associée
    if (hotel.imageUrl) {
      const imagePath = hotel.imageUrl.replace(/^.*\/images\//, '');
      fs.unlink(`images/${imagePath}`, (err) => {
        if (err) console.error('Erreur suppression image:', err);
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Hôtel supprimé avec succès!' });
  } catch (error) {
    console.error('Erreur suppression hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};