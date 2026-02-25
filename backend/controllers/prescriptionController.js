const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            });

        res.json({
            success: true,
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get prescriptions for a specific doctor
// @route   GET /api/prescriptions/doctor/:doctorId
// @access  Private
exports.getDoctorPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctor: req.params.doctorId })
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private
exports.createPrescription = async (req, res) => {
    try {
        const { patient, doctor, appointment, medicines, notes } = req.body;

        const prescription = await Prescription.create({
            patient,
            doctor,
            appointment,
            medicines,
            notes
        });

        // If linked to an appointment, update appointment status to Completed
        if (appointment) {
            await Appointment.findByIdAndUpdate(appointment, { status: 'Completed' });
        }

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name age gender' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            });

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        res.json({
            success: true,
            data: prescription
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
