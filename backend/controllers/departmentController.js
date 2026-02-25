const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

// Standard clinical departments (idempotent seed)
const CLINICAL_DEPARTMENTS = [
    { name: 'Cardiology', description: 'Heart and cardiovascular system disorders' },
    { name: 'Neurology', description: 'Brain, spinal cord, and nervous system conditions' },
    { name: 'Orthopedics', description: 'Bones, joints, ligaments, and musculoskeletal system' },
    { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
    { name: 'Dermatology', description: 'Skin, hair, and nail conditions' },
    { name: 'Ophthalmology', description: 'Eye and vision care' },
    { name: 'Gynecology', description: 'Female reproductive health and obstetrics' },
    { name: 'Oncology', description: 'Cancer diagnosis and treatment' },
    { name: 'Psychiatry', description: 'Mental health and behavioral disorders' },
    { name: 'General Surgery', description: 'Surgical procedures for general conditions' },
    { name: 'Emergency Medicine', description: 'Acute care and emergency interventions' },
    { name: 'Internal Medicine', description: 'Diagnosis and non-surgical treatment of adult diseases' },
    { name: 'Radiology', description: 'Medical imaging and diagnostic radiology' },
    { name: 'Anesthesiology', description: 'Anesthesia and perioperative care' },
    { name: 'Urology', description: 'Urinary tract and male reproductive system' },
    { name: 'ENT', description: 'Ear, nose, and throat disorders' },
];

// @desc    Seed standard clinical departments (idempotent)
// @route   POST /api/departments/seed
// @access  Public (safe — skips existing, insert-only)
exports.seedDepartments = async (req, res) => {
    try {
        // insertMany with ordered:false — skips duplicates on unique name, never throws
        const result = await Department.insertMany(CLINICAL_DEPARTMENTS, { ordered: false });
        const existing = await Department.countDocuments();
        res.json({
            success: true,
            inserted: result.length,
            total: existing,
            message: `${result.length} departments added. ${existing} total departments available.`
        });
    } catch (err) {
        // E11000 = duplicate key — some already existed, that's fine
        if (err.code === 11000 || (err.writeErrors && err.insertedDocs)) {
            const existing = await Department.countDocuments();
            return res.json({ success: true, inserted: err.insertedDocs?.length || 0, total: existing, message: 'Departments already seeded.' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};


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
