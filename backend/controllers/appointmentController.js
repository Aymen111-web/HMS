const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' }
            });

        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, isUrgent, reason, status } = req.body;

        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        if (!time) {
            return res.status(400).json({ success: false, message: 'Appointment time is required' });
        }

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            date,
            time,
            isUrgent: isUrgent || false,
            reason: reason || '',
            status: status || 'Pending'
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get appointments for a specific patient
// @route   GET /api/appointments/patient/:patientId
// @access  Private
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .sort({ date: -1, time: -1 });

        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get appointments for a specific doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private
exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId })
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ date: 1, time: 1 });

        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update appointment status/details
// @route   PATCH /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const { status, consultationNotes, diagnosis } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (consultationNotes) updateData.consultationNotes = consultationNotes;
        if (diagnosis) updateData.diagnosis = diagnosis;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.json({ success: true, data: appointment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        await appointment.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
