# Mon Vieux Grimoire - Backend

Backend d'une API REST pour un site de notation de livres, développé avec Node.js, Express et MongoDB.

## Stack Technique

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT + Bcrypt
- **Image Upload:** Multer + Sharp
- **Validation:** Mongoose

## Installation

### Prérequis
- Node.js (v19+)
- MongoDB Atlas account

### Backend

```bash
git clone https://github.com/[TON_USERNAME]/projet-6-mon-vieux-grimoire.git
cd backend
npm install
```

### Frontend

Le frontend React est fourni par OpenClassrooms:

```bash
git clone https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres.git
cd P7-Dev-Web-livres
npm install
```

### Variables d'environnement

Crée un fichier `.env` à la racine du **backend**:
MONGODB_URI=mongodb+srv://[USER]:[PASSWORD]@[CLUSTER].mongodb.net/?appName=OC
PORT=4000
JWT_SECRET=ta_clé_secrète_très_longue

### Lancer les serveurs

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Écoute sur http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd P7-Dev-Web-livres
npm start
# Écoute sur http://localhost:3000
```

Ouvre `http://localhost:3000` dans ton navigateur.

## Architecture

backend/
├── models/
│ ├── User.js # Schéma utilisateur
│ └── Book.js # Schéma livre
├── controllers/
│ ├── authController.js # Logique signup/login
│ └── booksController.js # Logique CRUD livres + notation
├── routes/
│ ├── auth.js # Routes authentification
│ └── books.js # Routes livres
├── middleware/
│ └── auth.js # Vérification JWT token
├── images/ # Dossier stockage images
├── app.js # Application Express
├── .env # Variables d'environnement (à créer)
└── package.json

## API Endpoints

### Authentification

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/signup` | Non | Créer un compte |
| POST | `/api/auth/login` | Non | Se connecter |

### Livres (Lecture)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/books` | Non | Tous les livres (triés par note) |
| GET | `/api/books/:id` | Non | Détails d'un livre |
| GET | `/api/books/bestrating` | Non | Top 3 meilleurs livres |

### Livres (Écriture)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/books` | Oui | Créer un livre + image |
| PUT | `/api/books/:id` | Oui | Modifier un livre |
| DELETE | `/api/books/:id` | Oui | Supprimer un livre |

### Notation

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/books/:id/rating` | Oui | Noter un livre (1x par user) |

## Fonctionnalités clés

✓ **Authentification JWT** - Tokens expirables 24h
✓ **Hachage sécurisé** - Passwords avec Bcrypt
✓ **Upload d'images** - Avec compression automatique (WebP, 500x500)
✓ **Notation de livres** - Un user, une note par livre
✓ **Moyenne automatique** - Recalculée après chaque notation
✓ **Sécurité** - Seul le créateur peut modifier/supprimer son livre
✓ **Green Code** - Images optimisées (Sharp compression 80%)

## Sécurité

- Passwords hachés avec Bcrypt (salt rounds: 10)
- Authentification JWT sur toutes les routes sensibles
- Vérification userId pour PUT/DELETE (403 si pas propriétaire)
- Emails uniques (plugin Mongoose)
- CORS configuré pour le frontend (port 3000)

## Structure des schémas

### User
```javascript
{
  email: String (unique),
  password: String (hachée)
}
```

### Book
```javascript
{
  userId: String,
  title: String,
  author: String,
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [{userId, grade}],
  averageRating: Number
}
```

## Développement

### Lancer avec auto-reload
```bash
npm install --save-dev nodemon
npm run dev
```

### Tester l'API
Utilise Postman, Thunder Client ou le frontend fourni.



Ce projet est réalisé dans le cadre de la formation OpenClassrooms.