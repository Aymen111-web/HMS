const Payment = require('../models/Payment');

exports.getPatientPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ patient: req.params.patientId })
            .populate('appointment')
            .sort({ date: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
