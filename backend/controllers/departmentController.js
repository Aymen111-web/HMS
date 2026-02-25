const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate({
            path: 'head',
            populate: { path: 'user', select: 'name' }
        });

        // Add doctor count for each department
        const deptsWithCount = await Promise.all(departments.map(async (dept) => {
            const count = await Doctor.countDocuments({ department: dept._id });
            return {
                ...dept.toObject(),
                doctorCount: count
            };
        }));

        res.json({ success: true, data: deptsWithCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
exports.createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
exports.deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
