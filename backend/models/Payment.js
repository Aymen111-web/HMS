const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    method: { type: String, enum: ['Cash', 'Card', 'Insurance'] },
    transactionId: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
