const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

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
            const doctor = await Doctor.create({
                user: user._id,
                specialization: 'General',
                fee: 500
            });
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

        if (user.role === 'Doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) doctorId = doctor._id;
        } else if (user.role === 'Patient') {
            const patient = await Patient.findOne({ user: user._id });
            if (patient) patientId = patient._id;
        }

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
                patientId
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
