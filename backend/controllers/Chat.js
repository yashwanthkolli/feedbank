const Chat = require('../models/Chat')
const Complaint = require('../models/Complaint')

exports.chat_registration = async(req, res) => {
    try{
        const { 
            text,
            sender_id,
            complaint_id
        } = req.body

        const chat =  new Chat({
            text,
            sender_id,
            complaint_id
        })

        await chat.save()
        res.send({message: 'Chat Saved', chat})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_complaints_chat = async(req, res) => {
    try{
        const chat = await Chat.find({ complaint_id: req.params.id }).populate('sender_id' , `name role`).sort({date: 1})
        const complaint = await Complaint.findById(req.params.id).populate('student_id' , `name`).select('subject complaint_details anonymity resolved date')

        res.send({chat, complaint})
    } catch(e) {
        res.status(500).json(e)
    }
}