const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get detailed admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            last7Days.push(date);
        }

        const [
            patientCount,
            doctorCount,
            appointmentCount,
            todayAppointments,
            urgentCases,
            totalRevenue,
            appointmentsTrend,
            deptDoctorStats,
            monthlyRegistrations
        ] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments(),
            Appointment.countDocuments(),
            Appointment.countDocuments({ date: { $gte: today } }),
            Appointment.countDocuments({ isUrgent: true, status: { $ne: 'Completed' } }),
            Payment.aggregate([
                { $match: { status: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            // Appointments trend for last 7 days
            Promise.all(last7Days.map(async (date) => {
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                const count = await Appointment.countDocuments({
                    date: { $gte: date, $lt: nextDay }
                });
                return {
                    name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    count
                };
            })),
            // Department-wise doctor count
            Doctor.aggregate([
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'dept'
                    }
                },
                {
                    $unwind: '$dept'
                },
                {
                    $project: {
                        name: '$dept.name',
                        count: 1
                    }
                }
            ]),
            // Monthly patient registration trend (last 6 months)
            Patient.aggregate([
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id': 1 } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                summary: {
                    totalPatients: patientCount,
                    totalDoctors: doctorCount,
                    totalAppointments: appointmentCount,
                    todayAppointments,
                    urgentCases,
                    revenue: totalRevenue[0]?.total || 0
                },
                charts: {
                    appointmentsTrend,
                    departmentStats: deptDoctorStats,
                    patientGrowth: monthlyRegistrations.map(m => ({
                        name: new Date(0, m._id - 1).toLocaleString('default', { month: 'short' }),
                        count: m.count
                    }))
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Toggle user status (e.g., active/inactive)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
    try {
        const { status, role } = req.body;
        if (role === 'Doctor') {
            await Doctor.findOneAndUpdate({ user: req.params.id }, { status });
        } else if (role === 'Patient') {
            await Patient.findOneAndUpdate({ user: req.params.id }, { status });
        }
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
