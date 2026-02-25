const express = require('express');
const router = express.Router();
const { getStats, getRecentActivities } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/recent', getRecentActivities);

module.exports = router;
