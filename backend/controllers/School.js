const School = require('../models/School')
const User = require('../models/User')
const createError = require('http-errors')

exports.school_registration = async(req, res) => {
    try{
        const { 
            name,
            school_code,
            phone_number,
            email,
            strength,
            fee_amount,
            plan
        } = req.body

        const school = new School({
            name,
            school_code,            
            contact: {phone_number, email},
            strength,
            fee_amount,
            plan
        })

        await school.save()
        res.send({message: "School data saved"})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.update_contact = async(req, res) => {
    try{
        const { school_code, email, phone_number } = req.body;

        const school = await School.findOne({ school_code });
        const contact = { 
            email: email ? email : school.contact.email,
            phone_number: phone_number ? phone_number : school.contact.phone_number
        }

        await School.findOneAndUpdate(
            { school_code },
            { contact },
            { new: true }
        )
        .then(docs => {
            res.send({
                message: "School data updated",
                school_details: docs
            })
        })
        .catch(err => res.status(500).json(err))
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.update_registration = async(req, res) => {
    try{
        const { school_code, plan, fee_amount } = req.body;

        const school = await School.findOne({ school_code });

        await School.findOneAndUpdate(
            { school_code },
            { 
                plan: plan ? plan : school.plan,
                fee_amount: fee_amount ? fee_amount : school.fee_amount
            },
            { new: true }
        )
        .then(docs => {
            res.send({
                message: "School data updated",
                school_details: docs
            })
        })
        .catch(err => res.status(500).json(err))
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_level1_school_details = async(req, res) => {
    try{
        const school = await School.findById(req.params.id).select('name school_code contact')

        res.send(school)
    } catch(e) {
        res.status(500).json({message: "No school data found"})
    }
}

exports.get_level2_school_details = async(req, res) => {
    try{
        const { username } = req.body
        const user = await User.findOne({ username })
        
        if(user.role === "Student") throw createError(500, 'Access Error')

        const school = await School.findById(req.params.id).select('name school_code contact strength fee_amount plan registration_date')

        res.send(school)
    } catch(e) {
        res.status(500).json({message: "No school data found", e})
    }
}