const express = require('express');
const router = express.Router();
const { getPatientPayments, createPayment } = require('../controllers/paymentController');

router.get('/patient/:patientId', getPatientPayments);
router.post('/', createPayment);

module.exports = router;
