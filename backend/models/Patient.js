const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number },
    gender: { type: String },
    bloodGroup: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
