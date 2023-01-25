const router = require('express').Router()

const { notification_registration, delete_notification, get_all_notications, get_weekly_notications, get_notification } = require('../controllers/Notification')

router.post('/register', notification_registration)
router.get('/delete/:id', delete_notification)
router.post('/get/all/:id', get_all_notications)
router.get('/get/weekly/:id', get_weekly_notications)
router.get('/get/:id', get_notification)

module.exports = router