const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
    try {
        const [patientCount, doctorCount, appointmentCount] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments(),
            Appointment.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                totalPatients: patientCount,
                totalDoctors: doctorCount,
                totalAppointments: appointmentCount,
                emergencyCases: 0 // Placeholder
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/recent
// @access  Private
exports.getRecentActivities = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(5)
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
            data: appointments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
