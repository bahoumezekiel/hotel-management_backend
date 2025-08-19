const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import des routes
const hotelRoutes = require('./routes/hotel');
const authRoutes = require('./routes/auth');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bahoumezekiel:L7RI7p7oBr0p90y2@cluster0.5ldppvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware CORS pour permettre les requêtes du frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://hotel-management-frontend-ovn1.vercel.app' // ton frontend Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (pour les images locales si nécessaire)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API de gestion d'hôtels fonctionne correctement !"
  });
});

// Middleware de gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne du serveur s\'est produite',
    error: error.message
  });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

module.exports = app;
