const Book = require('../models/Book');

// GET /api/books - Tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books/:id - Un livre
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books/bestrating - Top 3 par moyenne
exports.getBestRating = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/books - Créer livre
exports.createBook = async (req, res) => {
  try {
    const { title, author, year, genre, ratings, averageRating } = JSON.parse(req.body.book);

    const book = await Book.create({
      userId: req.userId,
      title,
      author,
      year,
      genre,
      imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '',
      ratings: ratings || [],
      averageRating: averageRating || 0
    });

    res.status(201).json({ message: 'Livre créé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/books/:id - Modifier livre
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    const bookData = req.body.book ? JSON.parse(req.body.book) : req.body;
    book.title = bookData.title || book.title;
    book.author = bookData.author || book.author;
    book.year = bookData.year || book.year;
    book.genre = bookData.genre || book.genre;
    if (req.file) {
      book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    await book.save();

    res.json({ message: 'Livre modifié' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fs = require('fs').promises;
const path = require('path');

// DELETE /api/books/:id - Supprimer livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    if (book.imageUrl) {
      const filename = book.imageUrl.split('/images/')[1];
      if (filename) {
        const filepath = path.join('images', filename);
        try {
          await fs.unlink(filepath);
        } catch (err) {
          console.log('Erreur suppression image:', err.message);
        }
      }
    }
    await Book.deleteOne({ _id: req.params.id });
    res.json({ message: 'Livre supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/books/:id/rating - Noter un livre
exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;

    // Vérifier que la note est entre 0 et 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Note entre 0 et 5' });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Vérifier que l'utilisateur n'a pas déjà noté ce livre
    const existingRating = book.ratings.find(r => r.userId === req.userId);
    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
    }

    // Ajouter la note
    book.ratings.push({
      userId: req.userId,
      grade: rating
    });

    // Recalculer la moyenne
    const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = sum / book.ratings.length;

    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};