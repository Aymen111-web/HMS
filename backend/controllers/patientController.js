const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public (Should be protected in production)
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Public
exports.createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
