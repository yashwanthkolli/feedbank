const router = require('express').Router();

const { chat_registration, get_complaints_chat } = require('../controllers/Chat');

router.post('/register', chat_registration);
router.get('/get/:id', get_complaints_chat);

module.exports = router