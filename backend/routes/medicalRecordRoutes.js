const express = require('express');
const router = express.Router();
const { getPatientMedicalRecords, createMedicalRecord } = require('../controllers/medicalRecordController');

router.get('/patient/:patientId', getPatientMedicalRecords);
router.post('/', createMedicalRecord);

module.exports = router;
