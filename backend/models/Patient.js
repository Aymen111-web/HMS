const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    medicalHistory: [{
        condition: String,
        date: Date,
        notes: String
    }],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
