const { secret } = require('../config')
const jwt = require('jsonwebtoken')


module.exports = function (roles) {

    return function (req, res, next) {
        const { cookies } = req
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            if ('UserHash' in cookies) {
                const token = cookies.UserHash
                if (!token) {
                    return res.status(403).json({ message: 'Пользователь не авторизован' })
                }
                const { roles: userRoles } = jwt.verify(token, secret)
                let hasRole = false
                userRoles.forEach(role => {
                    if (roles.includes(role)) {
                        hasRole = true
                    }
                    if (!hasRole) {
                        return res.status(403).json({ message: 'У вас нет доступа' })
                    }

                });
                next()
            }
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: 'Пользователь не авторизован' })
        }
    }

}