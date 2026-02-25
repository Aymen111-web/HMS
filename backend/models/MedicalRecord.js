const mongoose = require('mongoose');

const medicalRecordSchema = mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: { type: String, required: true },
    treatment: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
