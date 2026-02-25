const express = require('express');
const router = express.Router();

const {
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
} = require('../controllers/appointmentController');

router.get('/', getAppointments);
router.post('/', createAppointment);
router.patch('/:id', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;
