const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const booksController = require('../controllers/booksController');
const auth = require('../middleware/auth');

// Configuration Multer - stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware pour optimiser les images avec Sharp
const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Définir le nom du fichier
    const filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const filepath = path.join('images', filename);

    // Créer le dossier images s'il n'existe pas
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }

    // Optimiser et sauvegarder l'image
    await sharp(req.file.buffer)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Remplacer le filename dans req.file
    req.file.filename = filename;

    next();
  } catch (err) {
    res.status(500).json({ message: 'Erreur optimisation image: ' + err.message });
  }
};

// Routes publiques
router.get('/', booksController.getAllBooks);
router.get('/bestrating', booksController.getBestRating);
router.get('/:id', booksController.getBookById);

// Routes protégées avec upload d'image optimisée
router.post('/', auth, upload.single('image'), optimizeImage, booksController.createBook);
router.put('/:id', auth, upload.single('image'), optimizeImage, booksController.updateBook);
router.delete('/:id', auth, booksController.deleteBook);

// Route rating
router.post('/:id/rating', auth, booksController.rateBook);

module.exports = router;