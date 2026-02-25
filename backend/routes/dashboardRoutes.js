const express = require('express');
const router = express.Router();
const { getStats, getRecentActivities, getDoctorStats, getPatientStats } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/recent', getRecentActivities);
router.get('/doctor/:doctorId', getDoctorStats);
router.get('/patient/:patientId', getPatientStats);

module.exports = router;
