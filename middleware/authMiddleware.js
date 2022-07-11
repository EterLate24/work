const jwt = require('jsonwebtoken')
const {secret} = require('../config')



module.exports = (req, res, next) => {
    const { cookies } = req
    try {
        if ('UserHash' in cookies) {
            try {
                jwt.verify(cookies.UserHash, secret)
                next();
            }
            catch (e) {
                if (e instanceof jwt.JsonWebTokenError) {
                    res.redirect('/enter')
                }
            }
        }
        else {
            res.redirect('/enter')
        }
    } catch (e) {
        res.redirect('/enter')
    }

}