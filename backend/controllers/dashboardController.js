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

// @desc    Get dashboard stats for a specific doctor
// @route   GET /api/dashboard/doctor/:doctorId
// @access  Private
exports.getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const [totalAppointments, appointmentsToday, pendingReports, urgentCases] = await Promise.all([
            Appointment.countDocuments({ doctor: doctorId }),
            Appointment.countDocuments({
                doctor: doctorId,
                date: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lte: new Date().setHours(23, 59, 59, 999)
                }
            }),
            Appointment.countDocuments({ doctor: doctorId, status: 'Pending' }),
            Appointment.countDocuments({ doctor: doctorId, isUrgent: true, status: { $ne: 'Completed' } })
        ]);

        // Get unique patients count
        const uniquePatients = await Appointment.distinct('patient', { doctor: doctorId });

        res.json({
            success: true,
            data: {
                totalPatients: uniquePatients.length,
                appointmentsToday,
                upcomingAppointments: await Appointment.countDocuments({
                    doctor: doctorId,
                    date: { $gt: new Date() },
                    status: 'Confirmed'
                }),
                pendingReports,
                urgentCases
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
