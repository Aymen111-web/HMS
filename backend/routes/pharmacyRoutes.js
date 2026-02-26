const express = require('express');
const router = express.Router();
const {
    getPendingPrescriptions,
    approvePrescription,
    rejectPrescription,
    getApprovedPrescriptions,
    dispensePrescription,
    getRejectedHistory
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Pharmacist'));

router.get('/prescriptions/pending', getPendingPrescriptions);
router.get('/prescriptions/approved', getApprovedPrescriptions);
router.get('/prescriptions/rejected', getRejectedHistory);
router.patch('/prescriptions/:id/approve', approvePrescription);
router.patch('/prescriptions/:id/reject', rejectPrescription);
router.patch('/prescriptions/:id/dispense', dispensePrescription);

module.exports = router;
