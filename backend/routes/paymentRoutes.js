const express = require('express');
const router = express.Router();
const {
    getPatientPayments,
    createPayment,
    getAllPayments,
    getPaymentStats,
    updatePaymentStatus
} = require('../controllers/paymentController');

router.get('/', getAllPayments);
router.get('/stats', getPaymentStats);
router.get('/patient/:patientId', getPatientPayments);
router.post('/', createPayment);
router.patch('/:id', updatePaymentStatus);

module.exports = router;
