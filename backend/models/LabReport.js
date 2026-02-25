const mongoose = require('mongoose');

const labReportSchema = mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    testName: { type: String, required: true },
    results: { type: String },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    fileUrl: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('LabReport', labReportSchema);
