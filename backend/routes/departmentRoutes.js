const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, updateDepartment, deleteDepartment, seedDepartments } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDepartments);
router.post('/seed', seedDepartments);   // Must be before /:id — no auth, safe, idempotent
router.post('/', protect, authorize('Admin'), createDepartment);
router.put('/:id', protect, authorize('Admin'), updateDepartment);
router.delete('/:id', protect, authorize('Admin'), deleteDepartment);

module.exports = router;
