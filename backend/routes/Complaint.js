const router = require('express').Router();

const { complaint_registration, all_complaints_by_student, all_complaints_to_school, mark_resolved } = require('../controllers/Complaint');
const { teachersAuth } = require('../middleware/auth');

router.post('/register', complaint_registration)
router.post('/get/all/student/:id', all_complaints_by_student)
router.post('/get/all/school/:id', teachersAuth, all_complaints_to_school)
router.get('/:complaint_id/resolved', mark_resolved)

module.exports = router