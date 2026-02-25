const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
