const express = require('express');
const router = express.Router();
const {
    getPatients,
    getPatient,
    getPatientByUserId,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

router.get('/', getPatients);
router.get('/by-user/:userId', getPatientByUserId); // Must be before /:id
router.get('/:id', getPatient);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
