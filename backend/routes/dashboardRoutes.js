const express = require('express');
const router = express.Router();
const { getStats, getRecentActivities, getDoctorStats } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/recent', getRecentActivities);
router.get('/doctor/:doctorId', getDoctorStats);

module.exports = router;
