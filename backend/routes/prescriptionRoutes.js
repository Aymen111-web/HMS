const express = require('express');
const router = express.Router();
const {
    getPrescriptions,
    getDoctorPrescriptions,
    getPatientPrescriptions,
    createPrescription,
    getPrescription
} = require('../controllers/prescriptionController');

// All routes are protected - you might want to add auth middleware here later
router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.get('/doctor/:doctorId', getDoctorPrescriptions);
router.get('/patient/:patientId', getPatientPrescriptions);
router.get('/:id', getPrescription);

module.exports = router;
