const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('user', 'name email role isOnline lastLogin')
            .populate('department', 'name status');
        res.json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('user', 'name email role isOnline lastLogin')
            .populate('department', 'name status');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get doctor by userId (for recovery when doctorId missing from token)
// @route   GET /api/doctors/by-user/:userId
// @access  Private
exports.getDoctorByUserId = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.params.userId })
            .populate('user', 'name email role isOnline lastLogin')
            .populate('department', 'name status');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found for this user' });
        }
        res.json({ success: true, data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res) => {
    try {
        const { userId, specialization, fee, available } = req.body;

        // Check if user exists and is a doctor
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'Doctor') {
            return res.status(400).json({ success: false, message: 'User role must be Doctor' });
        }

        const doctor = await Doctor.create({
            user: userId,
            specialization,
            fee,
            available
        });

        res.status(201).json({
            success: true,
            data: doctor
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        await doctor.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
