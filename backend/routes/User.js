const router = require ('express').Router();

const { user_registration, user_login, get_user_details, change_password, update_contact, get_school_students, add_strike } = require('../controllers/User');

router.post('/register', user_registration)
router.post('/login', user_login)
router.get('/get/:id', get_user_details)
router.post('/update/password', change_password)
router.post('/update/contact', update_contact)
router.get('/get/school/:id', get_school_students)
router.get('/strike/:id', add_strike)

module.exports = router;