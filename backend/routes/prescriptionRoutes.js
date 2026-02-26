const express = require('express');
const router = express.Router();
const {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    getPrescriptionInitData
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getPrescriptions)
    .post(authorize('Doctor'), createPrescription);

router.get('/init/:appointmentId', authorize('Doctor'), getPrescriptionInitData);

router.route('/:id')
    .get(getPrescription)
    .put(authorize('Doctor'), updatePrescription);

module.exports = router;
