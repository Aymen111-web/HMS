const LabReport = require('../models/LabReport');

exports.getPatientLabReports = async (req, res) => {
    try {
        const reports = await LabReport.find({ patient: req.params.patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .sort({ date: -1 });
        res.json({ success: true, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createLabReport = async (req, res) => {
    try {
        const report = await LabReport.create(req.body);
        res.status(201).json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
