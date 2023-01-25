const Notification = require('../models/Notification');

exports.notification_registration = async(req, res) => {
    try{
        const {
            heading,
            body,
            school_id
        } = req.body
    
        const notifation = new Notification({ heading, body, school_id })
    
        await notifation.save()
        res.send({message: 'Notification saved', Notification})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.delete_notification = async(req, res) => {
    try{
        await Notification.findByIdAndDelete(req.params.id)
        res.send({message: 'Notification deleted'})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_all_notications = async(req, res) => {
    try{
        const { offset, limit } = req.body
        const notifications = await Notification.find({ school_id: req.params.id }).select('_id heading date').sort({date: -1}).skip(offset).limit(limit)
        const totalNotification = await Notification.countDocuments({})

        res.send({notifications, totalNotification})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_notification = async(req, res) => {
    try{
        const notification = await Notification.findById(req.params.id)
        
        res.send(notification)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.get_weekly_notications = async(req, res) => {
    try{
        const week = new Date()
        week.setDate(week.getDate() - 7)
        
        const notifications = await Notification.find({ school_id: req.params.id, date: { $gt: week } }).sort({date: -1})

        res.send(notifications)
    } catch(e) {
        res.status(500).json(e)
    }
}