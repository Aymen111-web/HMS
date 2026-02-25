const express = require('express');
const router = express.Router();
const {
    getPrescriptions,
    getDoctorPrescriptions,
    createPrescription,
    getPrescription
} = require('../controllers/prescriptionController');

// All routes are protected - you might want to add auth middleware here later
router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.get('/doctor/:doctorId', getDoctorPrescriptions);
router.get('/:id', getPrescription);

module.exports = router;
