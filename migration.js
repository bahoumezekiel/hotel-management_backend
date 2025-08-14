// migration.js - À placer à la racine de votre projet backend
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement

// Import du modèle Hotel
const Hotel = require('./models/Hotel');

async function migrateHotels() {
  try {
    console.log('🔄 Début de la migration...');
    
    // Connexion à MongoDB avec la même URL que votre app
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bahoumezekiel:L7RI7p7oBr0p90y2@cluster0.5ldppvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier combien d'hôtels n'ont pas le champ ville
    const hotelsWithoutVille = await Hotel.countDocuments({ ville: { $exists: false } });
    console.log(`📊 ${hotelsWithoutVille} hôtels sans le champ ville trouvés`);
    
    if (hotelsWithoutVille === 0) {
      console.log('✅ Tous les hôtels ont déjà le champ ville. Aucune migration nécessaire.');
      process.exit(0);
    }
    
    // Mettre à jour tous les hôtels sans le champ ville
    const result = await Hotel.updateMany(
      { ville: { $exists: false } }, 
      { $set: { ville: 'Non renseigné', updatedAt: new Date() } }
    );
    
    console.log(`✅ Migration terminée : ${result.modifiedCount} hôtels mis à jour`);
    
    // Vérification finale
    const totalHotels = await Hotel.countDocuments();
    const hotelsWithVille = await Hotel.countDocuments({ ville: { $exists: true } });
    
    console.log(`📈 Résumé final :`);
    console.log(`   - Total d'hôtels : ${totalHotels}`);
    console.log(`   - Hôtels avec ville : ${hotelsWithVille}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateHotels();