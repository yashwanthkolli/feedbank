const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notification', NotificationSchema);