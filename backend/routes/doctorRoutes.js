const express = require('express');
const router = express.Router();

const {
    getDoctors,
    getDoctor,
    getDoctorByUserId,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/by-user/:userId', getDoctorByUserId); // Must be before /:id
router.get('/:id', getDoctor);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
