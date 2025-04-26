// routes/students.js
const express = require('express');
const { searchStudents, getStudentById, getStudentsForJob } = require('../controllers/studentController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.get('/search', searchStudents);
router.get('/job',authenticateJWT, getStudentsForJob);
router.get("/:id", getStudentById);

module.exports = router;
