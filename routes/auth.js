const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

// Route d'inscription
router.post('/signup', authCtrl.signup);

// Route de connexion
router.post('/login', authCtrl.login);

// Route de déconnexion
router.post('/logout', authCtrl.logout);

// Route mot de passe oublié
router.post('/forgot-password', authCtrl.forgotPassword);

// Route de réinitialisation du mot de passe
router.patch('/reset-password/:token', authCtrl.resetPassword);

// Route de test pour vérifier si l'utilisateur est connecté
router.get('/me', authCtrl.protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;