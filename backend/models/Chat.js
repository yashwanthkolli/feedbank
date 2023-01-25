const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Chat', ChatSchema)