const cloudinary = require('cloudinary').v2;

// Charger les variables d’environnement
require('dotenv').config();

// Configurer Cloudinary avec les valeurs de .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
