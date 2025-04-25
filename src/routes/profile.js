// routes/profile.js
const express = require('express');
const {
    getProfile,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
} = require('../controllers/profileController');
const authenticateJWT = require('../middleware/auth'); // ты уже писал её в server.js

const router = express.Router();

router.get('/', authenticateJWT, getProfile);
router.put('/', authenticateJWT, updateProfile);

router.post('/experience', authenticateJWT, addExperience);
router.put('/experience/:id', authenticateJWT, updateExperience);
router.delete('/experience/:id', authenticateJWT, deleteExperience);

module.exports = router;
