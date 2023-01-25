const router = require ('express').Router();
const { school_registration, update_contact, update_registration, get_level1_school_details, get_level2_school_details } = require('../controllers/School');


router.post('/register', school_registration)
router.post('/update/contact', update_contact)
router.post('/update/registration', update_registration)
router.get('/get/:id', get_level1_school_details)
router.post('/get/:id', get_level2_school_details)

module.exports = router;