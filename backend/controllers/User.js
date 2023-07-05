const User = require('../models/User')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

exports.user_registration = async (req, res) => {
    try{
        const { 
            username, 
            password, 
            name, 
            school_id,
            email,
            phone_number,
            role
        } = req.body

        const doesExist = await User.findOne({ username })

        if(doesExist) throw createError.Conflict('Error- Username Already Exists')

        const user = new User({
            username,
            password,
            name,
            school_id,
            contact: { phone_number, email },
            role
        })

        await user.save()
        res.send({message: "User data saved"})
    } catch(e) {
        res.status(500).json(e)
    }
} 

exports.user_login = async(req, res) => {
    try{
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if(!user) throw createError(500, 'User not found')
        if(user.number_of_strikes >= 1) throw createError(500, 'Account banned with 1 strikes')

        const { _id, name, school_id, role } = user
        await user.comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            if(!isMatch) return res.status(500).json({message: 'Wrong Passsword'});

            const token = jwt.sign({ _id, name, school_id, role }, process.env.JWT_SECRET)

            res.send({message: 'Login Successful', token })
        })
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_user_details = async(req, res) => {
    try{
        const user = await User.findById(req.params.id).populate('school_id', 'name').select('username name school_id role number_of_strikes contact')

        res.send(user)
    } catch(e) {
        res.status(500).json({message: "No user data found"})
    }
}

exports.change_password = async(req, res) => {
    try {
        const { username, password, newPassword } = req.body
        const user = await User.findOne({ username })

        if(!user) throw createError(500, 'User not found')

        await user.comparePassword(password, async function(err, isMatch) {
            if (err) throw err;
            if(!isMatch) return res.send({message: 'Wrong Passsword'});

            user.password = newPassword;
            await user.save()

            res.send({message: 'Password updated'})
        })
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.update_contact = async(req, res) => {
    try{
        const { username, email, phone_number, password } = req.body;
        const user = await User.findOne({ username });

        if(!user) throw createError(500, 'User not found')

        const contact = { 
            email: email ? email : user.contact.email,
            phone_number: phone_number ? phone_number : user.contact.phone_number
        }

        await user.comparePassword(password, async function(err, isMatch) {
            if (err) throw err;
            if(!isMatch) return res.send({message: 'Wrong Passsword'});

            user.contact = contact;
            await user.save()

            res.send({message: 'Contact updated'})
        })
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_school_students = async(req, res) => {
    try{
        const users = await User.find({school_id: req.params.id, role: 'Student'}).select('username name contact number_of_strikes').sort({username: 1})

        res.send(users)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.add_strike = async(req, res) => {
    try{
        await User.findByIdAndUpdate(req.params.id, { $inc:  {"number_of_strikes": 1}})

        res.send({message: 'Reported!'})
    }   
    catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
}