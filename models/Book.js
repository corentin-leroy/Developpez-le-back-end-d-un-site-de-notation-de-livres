const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: String,
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: String,
      grade: { 
        type: Number, 
        min: 0, 
        max: 5 
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Book', bookSchema);