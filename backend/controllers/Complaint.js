const Complaint = require('../models/Complaint');

exports.complaint_registration = async(req, res) => {
    try{
        const {
            subject, 
            complaint_details,
            student_id,
            school_id,
            anonymity
        } = req.body

        const complaint = new Complaint({
            subject, 
            complaint_details,
            student_id,
            school_id,
            anonymity
        })

        await complaint.save()
        res.send({message: 'Complaint Registered', complaint})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.all_complaints_by_student = async(req, res) => {
    try{
        const { offset = 0 } = req.body
        const complaints = await Complaint.find({ student_id: req.params.id }).populate('student_id', 'name').sort({date: -1}).skip(offset).limit(10)

        res.send(complaints)
    } catch(e) {
        res.status(500).json(e)
    }

}

exports.all_complaints_to_school = async(req, res) => {
    try{
        const { offset = 0 } = req.body
        const complaints = await Complaint.find({ school_id: req.params.id }).populate('student_id', 'name').sort({ date: -1 }).skip(offset).limit(10)

        res.send(complaints)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.mark_resolved = async(req, res) => {
    try{
        await Complaint.findByIdAndUpdate(req.params.complaint_id, {resolved: true})

        res.send({message: 'Marked as Resovled'})
    } catch(e) {
        res.status(500).json(e)
    }
}