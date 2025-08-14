const mongoose = require('mongoose');
const { applyUserMiddlewares } = require('../middleware/auth');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'email requis'],
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email invalide'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, '6 caractères minimum'],
    maxlength: [20, '20 caractères maximum'],
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: { // Nom corrigé avec "s"
    type: Date,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Plugin d'unicité
userSchema.plugin(uniqueValidator);

// Application des middlewares
applyUserMiddlewares(userSchema);

// Middleware pour les mises à jour
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('User', userSchema);