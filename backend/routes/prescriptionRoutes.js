const express = require('express');
const router = express.Router();
const {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    getPrescriptionInitData,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getPendingPrescriptions,
    approvePrescription,
    rejectPrescription,
    getApprovedPrescriptions,
    dispensePrescription,
    getRejectedHistory
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getPrescriptions)
    .post(authorize('Doctor'), createPrescription);

router.get('/pending', authorize('Pharmacist'), getPendingPrescriptions);
router.get('/approved', authorize('Pharmacist'), getApprovedPrescriptions);
router.get('/rejected', authorize('Pharmacist'), getRejectedHistory);
router.patch('/:id/approve', authorize('Pharmacist'), approvePrescription);
router.patch('/:id/reject', authorize('Pharmacist'), rejectPrescription);
router.patch('/:id/dispense', authorize('Pharmacist'), dispensePrescription);

router.get('/init/:appointmentId', authorize('Doctor'), getPrescriptionInitData);
router.get('/patient/:patientId', getPatientPrescriptions);
router.get('/doctor/:doctorId', getDoctorPrescriptions);

router.route('/:id')
    .get(getPrescription)
    .put(authorize('Doctor'), updatePrescription);

module.exports = router;
