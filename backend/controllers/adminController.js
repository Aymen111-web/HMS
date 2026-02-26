const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all currently online/active users
// @route   GET /api/admin/active-users
// @access  Private/Admin
exports.getActiveUsers = async (req, res) => {
    try {
        const onlineUsers = await User.find({ isOnline: true }).select('-password').sort({ lastLogin: -1 });

        const doctors = [];
        const patients = [];
        const admins = [];

        await Promise.all(onlineUsers.map(async (u) => {
            if (u.role === 'Doctor') {
                const profile = await Doctor.findOne({ user: u._id }).select('specialization department');
                doctors.push({ ...u.toObject(), profile });
            } else if (u.role === 'Patient') {
                const profile = await Patient.findOne({ user: u._id }).select('bloodGroup gender age');
                patients.push({ ...u.toObject(), profile });
            } else if (u.role === 'Admin') {
                admins.push(u.toObject());
            }
        }));

        res.json({
            success: true,
            data: {
                total: onlineUsers.length,
                doctors,
                patients,
                admins,
                // counts for quick display
                doctorCount: doctors.length,
                patientCount: patients.length
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


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
// @desc    Get all pharmacists
// @route   GET /api/admin/pharmacists
// @access  Private/Admin
exports.getPharmacists = async (req, res) => {
    try {
        const Pharmacist = require('../models/Pharmacist');
        const pharmacists = await Pharmacist.find().populate('user', 'name email createdAt');
        res.json({ success: true, data: pharmacists });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create a new pharmacist
// @route   POST /api/admin/pharmacists
// @access  Private/Admin
exports.createPharmacist = async (req, res) => {
    try {
        const { name, email, password, licenseNumber, phone } = req.body;
        const bcrypt = require('bcryptjs');

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Pharmacist'
        });

        const Pharmacist = require('../models/Pharmacist');
        const pharmacist = await Pharmacist.create({
            user: user._id,
            licenseNumber,
            phone
        });

        res.status(201).json({
            success: true,
            data: {
                ...pharmacist.toObject(),
                user: { name: user.name, email: user.email }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a pharmacist
// @route   DELETE /api/admin/pharmacists/:id
// @access  Private/Admin
exports.deletePharmacist = async (req, res) => {
    try {
        const Pharmacist = require('../models/Pharmacist');
        const pharmacist = await Pharmacist.findById(req.params.id);

        if (!pharmacist) {
            return res.status(404).json({ success: false, message: 'Pharmacist not found' });
        }

        // Delete associated user
        await User.findByIdAndDelete(pharmacist.user);
        // Delete pharmacist profile
        await pharmacist.deleteOne();

        res.json({ success: true, message: 'Pharmacist deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// @desc    Get pharmacist by User ID
// @route   GET /api/admin/pharmacists/by-user/:userId
// @access  Private
exports.getPharmacistByUserId = async (req, res) => {
    try {
        const Pharmacist = require('../models/Pharmacist');
        const pharmacist = await Pharmacist.findOne({ user: req.params.userId }).populate('user', 'name email');
        if (!pharmacist) {
            return res.status(404).json({ success: false, message: 'Pharmacist not found' });
        }
        res.json({ success: true, data: pharmacist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
