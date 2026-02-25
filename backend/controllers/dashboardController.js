const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const Payment = require('../models/Payment');

// @desc    Get dashboard stats for a specific patient
// @route   GET /api/dashboard/patient/:patientId
// @access  Private
exports.getPatientStats = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        const [totalAppointments, upcomingAppointments, pastAppointments, totalPrescriptions, labReports, pendingPayments] = await Promise.all([
            Appointment.countDocuments({ patient: patientId }),
            Appointment.countDocuments({
                patient: patientId,
                date: { $gte: new Date().setHours(0, 0, 0, 0) },
                status: { $in: ['Pending', 'Confirmed'] }
            }),
            Appointment.countDocuments({
                patient: patientId,
                status: 'Completed'
            }),
            Prescription.countDocuments({ patient: patientId }),
            LabReport.countDocuments({ patient: patientId }),
            Payment.countDocuments({ patient: patientId, status: 'Pending' })
        ]);

        // Get the next scheduled appointment
        const nextAppointment = await Appointment.findOne({
            patient: patientId,
            date: { $gte: new Date() },
            status: 'Confirmed'
        }).populate({
            path: 'doctor',
            populate: { path: 'user', select: 'name' }
        }).sort({ date: 1, time: 1 });

        res.json({
            success: true,
            data: {
                totalAppointments,
                upcomingAppointments,
                pastAppointments,
                totalPrescriptions,
                labReports,
                pendingPayments,
                nextAppointment
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

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
