const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    school_code: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        phone_number: String,
        email: String
    },
    strength: {
        type: Number,
        required: true
    },
    fee_amount: {
        type: Number,
        required: true
    },
    plan: {
        type: String,
        default: 'Premium',
        enum: ['Premium']
    },
    registration_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('School', SchoolSchema);