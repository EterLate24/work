const { Router } = require('express')
const { route } = require('express/lib/application')
const router = Router()
const { response } = require('express')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const jwt = require('jsonwebtoken')
const controller = require('../authController')



// Main
router.get('/', async (req, res) => {

    res.render('index', {
        title: 'Главная',
        home: true
    })
})

// Admin panel

router.get('/admin', async (req, res) => {

    res.render('index', {
        title: 'Панель администратора',
        home: true
    })
})


//-----------------------Auth
//Registration
router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 15 символов').isLength({ min: 4, max: 15 }),
],
    controller.registration)

//Registration page
router.get('/registration_page', (req, res) => {
    res.render('registration_page', {
        title: 'Зарегистрироваться',
    })
})

//Login
router.post('/login', controller.login)

//Login page
router.get('/enter', (req, res) => {
    res.render('enter', {
        title: 'Войти',
    })
})

//Logout
router.get('/out', (req, res) => {
    res.clearCookie('UserHash')
    res.redirect('/enter')
})

module.exports = router