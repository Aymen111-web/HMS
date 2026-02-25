const Payment = require('../models/Payment');

exports.getPatientPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ patient: req.params.patientId })
            .populate('appointment')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getPaymentStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0] }
                    },
                    pendingAmount: {
                        $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] }
                    },
                    completedPayments: {
                        $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0] || { totalRevenue: 0, pendingAmount: 0, completedPayments: 0 }
        });
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

exports.updatePaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json({ success: true, data: payment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
