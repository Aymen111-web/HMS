const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Pharmacist = require('../models/Pharmacist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, specialization, department, fee } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        let doctorId = null;
        let patientId = null;

        if (role === 'Doctor') {
            const doctorData = {
                user: user._id,
                specialization: specialization || 'General',
                fee: fee || 500
            };
            // Only attach department if provided (it's an ObjectId ref)
            if (department) doctorData.department = department;

            const doctor = await Doctor.create(doctorData);
            doctorId = doctor._id;
        } else if (role === 'Patient') {
            const patient = await Patient.create({
                user: user._id
            });
            patientId = patient._id;
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId,
                patientId
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let doctorId = null;
        let patientId = null;

        let pharmacistId = null;

        if (user.role === 'Doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) doctorId = doctor._id;
        } else if (user.role === 'Patient') {
            const patient = await Patient.findOne({ user: user._id });
            if (patient) patientId = patient._id;
        } else if (user.role === 'Pharmacist') {
            const pharmacist = await Pharmacist.findOne({ user: user._id });
            if (pharmacist) pharmacistId = pharmacist._id;
        }

        // Mark user as online and record login time
        await User.findByIdAndUpdate(user._id, {
            isOnline: true,
            lastLogin: new Date()
        });

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId,
                patientId,
                pharmacistId
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Logout user (mark offline)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const jwt = require('jsonwebtoken');
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await User.findByIdAndUpdate(decoded.id, { isOnline: false });
            } catch (e) {
                // Token may be expired — try to mark offline by body userId
                if (req.body?.userId) {
                    await User.findByIdAndUpdate(req.body.userId, { isOnline: false });
                }
            }
        } else if (req.body?.userId) {
            await User.findByIdAndUpdate(req.body.userId, { isOnline: false });
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
