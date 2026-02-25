const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['Appointment', 'Urgent', 'LabResult', 'General'], default: 'General' },
    isRead: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
