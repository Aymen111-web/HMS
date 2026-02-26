const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Get all prescriptions for a doctor
// @route   GET /api/prescriptions
// @access  Private/Doctor
exports.getPrescriptions = async (req, res) => {
    try {
        let query = {};

        // Doctors see their own prescriptions, Patients see prescriptions for them
        if (req.user.role === 'Doctor') {
            // Find the doctor ID associated with this user
            const Doctor = require('../models/Doctor');
            const doctor = await Doctor.findOne({ user: req.user.id });
            if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
            query.doctor = doctor._id;
        } else if (req.user.role === 'Patient') {
            const Patient = require('../models/Patient');
            const patient = await Patient.findOne({ user: req.user.id });
            if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
            query.patient = patient._id;
        }

        const prescriptions = await Prescription.find(query)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            });

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        res.json({ success: true, data: prescription });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get data to initialize a prescription form
// @route   GET /api/prescriptions/init/:appointmentId
// @access  Private/Doctor
exports.getPrescriptionInitData = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .populate('doctor');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Security check: Ensure this appointment belongs to the logged-in doctor
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (appointment.doctor._id.toString() !== doctor._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to prescribe for this appointment' });
        }

        res.json({
            success: true,
            data: {
                appointmentId: appointment._id,
                patientId: appointment.patient._id,
                patientName: appointment.patient.user.name,
                doctorId: doctor._id,
                diagnosis: appointment.reason || '' // Fill with appointment reason if available
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, appointmentId, diagnosis, medicines, instructions } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        // Find doctor ID
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        // Double check appointment exists and belongs to doctor
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment || appointment.doctor.toString() !== doctor._id.toString()) {
            return res.status(401).json({ success: false, message: 'Invalid appointment or unauthorized' });
        }

        const prescription = await Prescription.create({
            patient: patientId,
            doctor: doctor._id,
            appointment: appointmentId,
            diagnosis,
            medicines,
            instructions
        });

        // Mark appointment as 'Completed'
        appointment.status = 'Completed';
        await appointment.save();

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private/Doctor
exports.updatePrescription = async (req, res) => {
    try {
        let prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        // Make sure user is the doctor who wrote it
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (prescription.doctor.toString() !== doctor._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this prescription' });
        }

        prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: prescription });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get prescriptions for a specific patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: prescriptions.length,
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
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all pending prescriptions
// @route   GET /api/prescriptions/pending
// @access  Private/Pharmacist
exports.getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'PENDING' })
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Approve prescription
// @route   PATCH /api/prescriptions/:id/approve
// @access  Private/Pharmacist
exports.approvePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, {
            status: 'APPROVED',
            pharmacyNotes: req.body.notes || 'Medicine approved and ready for pickup.'
        }, { new: true });

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        res.json({ success: true, data: prescription });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reject prescription
// @route   PATCH /api/prescriptions/:id/reject
// @access  Private/Pharmacist
exports.rejectPrescription = async (req, res) => {
    try {
        if (!req.body.notes) {
            return res.status(400).json({ success: false, message: 'Rejection reason is required' });
        }

        const prescription = await Prescription.findByIdAndUpdate(req.params.id, {
            status: 'REJECTED',
            pharmacyNotes: req.body.notes
        }, { new: true });

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        res.json({ success: true, data: prescription });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
