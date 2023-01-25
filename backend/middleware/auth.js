const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
    if(!req.get('Authorization')){
        return(next(res.status(401).json({error: "Unauthorized"})))
    }

    const token = req.get('Authorization').split(' ')[1]

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { _id: decode._id, role: decode.role, school_id: decode.school_id }
        next()
    } catch(e) {
        next(res.status(401).json({error: "Unauthorized"}))
    }
}

exports.teachersAuth = (req, res, next) => {
    if(req.user.role === 'Student') {
        return(next(res.status(401).json({error: "Unauthorized"})))
    }
    next()
}