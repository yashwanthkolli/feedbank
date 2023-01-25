const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const createError = require('http-errors')

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    contact: {
        phone_number: String,
        email: String
    },
    role: {
        type: String,
        required: true,
        default: 'Student',
        enum: ['Student', 'Teacher', 'Staff']
    },
    number_of_strikes: {
        type: Number,
        default: 0
    }
})

UserSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;

        next()
    } catch(e) {
        next(e)
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword, cb) {
    if(!candidatePassword) throw createError(500, 'Password required')
    await bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);