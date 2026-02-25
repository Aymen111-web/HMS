const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, createNotification } = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markAsRead);

module.exports = router;
