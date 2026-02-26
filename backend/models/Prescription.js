const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: { type: String },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String }, // e.g., "Twice a day"
        duration: { type: String, required: true },
        instructions: { type: String }
    }],
    instructions: { type: String }, // General instructions
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    pharmacyNotes: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    dispensed: { type: Boolean, default: false },
    dispensedAt: { type: Date }
}, { timestamps: true });

// Performance Indexes
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ dispensed: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
