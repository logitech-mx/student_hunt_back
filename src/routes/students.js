// routes/students.js
const express = require('express');
const { searchStudents,getStudentById  } = require('../controllers/studentController');

const router = express.Router();

router.get('/search', searchStudents);
router.get("/:id", getStudentById);

module.exports = router;
