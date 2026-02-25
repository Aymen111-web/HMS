const express = require('express');
const router = express.Router();

const {
    getAppointments,
    createAppointment,
    getDoctorAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

router.get('/', getAppointments);
router.post('/', createAppointment);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
