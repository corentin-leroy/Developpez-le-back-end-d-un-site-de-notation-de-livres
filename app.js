require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
 
const app = express();
 
// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connecté à MongoDB Atlas'))
  .catch(err => console.error('✗ Erreur connexion:', err));
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
 
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
 
// Démarrage
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✓ Serveur écoute sur le port ${PORT}`);
});
 
module.exports = app;