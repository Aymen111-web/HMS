const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public (Should be protected in production)
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('user', 'name email role');
        res.json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get patient by userId (for recovery when patientId missing from token)
// @route   GET /api/patients/by-user/:userId
// @access  Private
exports.getPatientByUserId = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.params.userId }).populate('user', 'name email role');
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found for this user' });
        }
        res.json({ success: true, data: patient });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Public
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('user', 'name email role');
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Public
exports.createPatient = async (req, res) => {
    try {
        const { userId, age, gender, bloodGroup } = req.body;

        // If userId is provided, use it. Otherwise, this might be a placeholder for direct creation logic
        // For simplicity, let's assume userId is provided or we allow creating without it if the model allows (but it requires user)
        const patient = await Patient.create({
            user: userId,
            age,
            gender,
            bloodGroup
        });

        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        await patient.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
