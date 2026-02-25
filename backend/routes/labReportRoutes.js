const express = require('express');
const router = express.Router();
const { getPatientLabReports, createLabReport } = require('../controllers/labReportController');

router.get('/patient/:patientId', getPatientLabReports);
router.post('/', createLabReport);

module.exports = router;
