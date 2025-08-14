const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    name : {
        type : String,
        required: [true ,'le nom est obligatoire'],
        trim : true, // Supprimer les espaces inutiles
        maxlength: [100, 'le nom ne doit pas dépasser 100 caractères']
    },

    description:{
        type : String,
        required: [true ,'la description est obligatoire'],
        trim : true, // Supprimer les espaces inutiles
        maxlength: [2000, 'la description ne doit pas dépasser 2000 caractères']
    },  

    ville: {
        type: String,
        required: [true, 'la ville est obligatoire'],
        trim: true,
        maxlength: [100, 'la ville ne doit pas dépasser 100 caractères']
    },

    imageUrl:{type: String, required:[true, 'l\'image est requise']},

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }


})

//middleware pour mettre à jour updatedAt avant chaque sauvegarde
hotelSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

//middleware pour mettre à jour updatedAt lors de la mise à jour

hotelSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Hotel', hotelSchema);