const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, getActiveUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/active-users', getActiveUsers);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
