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
    res.clearCookie('UserData')
    res.redirect('/enter')
})

//-----------------------admin panel and cab
// Admin panel
router.get('/admin_panel', roleMiddleware(['ADMIN']), async (req, res) => {
    res.render('admin_panel', {
        title: 'Панель администратора',
    })
})

//Cab
router.get('/cab', authMiddleware, async (req, res) => {
    const { cookies } = req
    // const phone = JSON.parse(cookies.UserData).phone_number
    // const massiv = await applications.find({ phone_number: phone }).lean()
    res.render('cab', {
        title: 'Личный кабинет'
    })
})


module.exports = router