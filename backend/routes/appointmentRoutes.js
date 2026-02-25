const express = require('express');
const router = express.Router();

const {
    getAppointments,
    createAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

router.get('/', getAppointments);
router.post('/', createAppointment);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.get('/patient/:patientId', getPatientAppointments);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
