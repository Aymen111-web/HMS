const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get medical records for a specific patient
// @route   GET /api/medical-records/patient/:patientId
// @access  Private
exports.getPatientMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.params.patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .sort({ date: -1 });

        res.json({
            success: true,
            data: records
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create medical record (Usually by doctor)
// @route   POST /api/medical-records
// @access  Private
exports.createMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.create(req.body);
        res.status(201).json({
            success: true,
            data: record
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
