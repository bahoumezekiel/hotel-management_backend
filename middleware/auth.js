const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware Mongoose pour hasher le mot de passe
const hashPasswordMiddleware = async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
};

// Mise à jour du timestamp
const updateTimestampMiddleware = function(next) {
  this.updatedAt = Date.now();
  next();
};

// Méthode pour comparer les mots de passe
const comparePasswordMethod = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token de réinitialisation
const createPasswordResetTokenMethod = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Génération du JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Envoi du token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

// Middleware de protection
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vous n\'êtes pas connecté'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur n\'existe plus'
      });
    }

    if (!currentUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    req.user = currentUser;
    next();

  } catch (error) {
    console.error('Erreur middleware protection:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Application des middlewares au schéma
const applyUserMiddlewares = (userSchema) => {
  userSchema.pre('save', hashPasswordMiddleware);
  userSchema.pre('save', updateTimestampMiddleware);
  userSchema.methods.comparePassword = comparePasswordMethod;
  userSchema.methods.createPasswordResetToken = createPasswordResetTokenMethod;
};

module.exports = {
  hashPasswordMiddleware,
  updateTimestampMiddleware,
  comparePasswordMethod,
  createPasswordResetTokenMethod,
  signToken,
  createSendToken,
  protect,
  applyUserMiddlewares
};