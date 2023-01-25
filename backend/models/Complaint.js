const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    complaint_details: {
        type: String,
        default: ''
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    anonymity: {
        type: Boolean,
        default: false
    },
    attended_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    resolved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Complaint', ComplaintSchema)