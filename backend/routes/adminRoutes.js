const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getAllUsers,
    getActiveUsers,
    toggleUserStatus,
    getPharmacists,
    createPharmacist,
    deletePharmacist,
    getPharmacistByUserId
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/pharmacists/by-user/:userId', getPharmacistByUserId);

router.use(authorize('Admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/active-users', getActiveUsers);
router.patch('/users/:id/status', toggleUserStatus);

router.route('/pharmacists')
    .get(getPharmacists)
    .post(createPharmacist);

router.delete('/pharmacists/:id', deletePharmacist);

module.exports = router;
