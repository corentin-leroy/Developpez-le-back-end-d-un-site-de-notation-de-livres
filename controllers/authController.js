const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et password requis' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès' });

  } catch (err) {
    if (err.code === 11000 || err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie que email et password sont fournis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et password requis' });
    }

    // Cherche l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Email/password incorrect' });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Email/password incorrect' });
    }

    // Crée un JWT token contenant l'userId
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retourne l'userId et le token
    res.json({
      userId: user._id,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};