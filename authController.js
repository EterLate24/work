const User = require('./models/user')
const Role = require('./models/role')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { username, password} = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'USER' })
            const user = new User({ username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({ message: 'Пользователь зарегистрирован' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: `Введён неверный пароль` })
            }
            const token = generateAccessToken(user._id, user.roles)
            res.cookie('UserHash', token)
            res.cookie('UserData', JSON.stringify({
                username: user.username,
                id: user._id
            }))
            
            res.redirect('/')

        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Login error' })
        }
    }
}

module.exports = new authController