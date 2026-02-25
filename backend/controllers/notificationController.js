const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: notifications
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
