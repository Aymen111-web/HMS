const express = require('express');
const router = express.Router();
const { getPatients, createPatient } = require('../controllers/patientController');

// @route   GET /api/patients
router.get('/', getPatients);

// @route   POST /api/patients
router.post('/', createPatient);

module.exports = router;
