const { Router } = require('express')
const { route } = require('express/lib/application')
const router = Router()
const { response } = require('express')

const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const jwt = require('jsonwebtoken')
const controller = require('../authController')

//const { data } = require('../data')
const item = require('../models/item')
const purchase = require('../models/purchase')
const user = require('../models/user')

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

//-----------------------Аdmin panel and cab
// Admin panel
router.get('/admin_panel', roleMiddleware(['ADMIN']), async (req, res) => {
    const massiv = await item.find().lean()
    res.render('admin_panel', {
        title: 'Admin panel',
        massiv
    })
})

//Cab
router.get('/cab', authMiddleware, async (req, res) => {
    const { cookies } = req
    id_user = JSON.parse(cookies.UserData).id

    let purchase_info = await purchase.find({user_id: id_user}).lean()
    all_items = []
    
    for (i=0; i < purchase_info.length; i++){
        item_info =  await item.find({_id: purchase_info[i].item_id}).lean()
        all_items.push(Object.assign(item_info[0], {date: purchase_info[i].date}))
    }
    res.render('cab', {
        title: 'Cab',
        all_items,

    })
})

//-----------------------Editing items by admin
//Edit item page
router.post('/edit_item', (req, res) => {
    _id = req.body._id
    Name = req.body.name,
    description = req.body.description,
    price = req.body.price
    enabled = req.body.enabled,
    type = req.body.type,
    res.render('edit_item', {
        _id,
        Name,
        description,
        price,
        enabled,
        type,
        title: 'Editing'
    })
})

//Save editing item
router.post('/save_item', async (req, res) => {
    const poc = await item.findByIdAndUpdate(req.body._id, {
        Name: req.body.Name,
        description: req.body.description,
        price: req.body.price,
        enabled: req.body.enabled,
        type: req.body.type
    })
    res.redirect('/admin_panel')
})

//Delete item
router.get('/delete_item', async (req, res) => {
    await item.findByIdAndDelete({ _id: req.query._id })
    res.redirect('/admin_panel')
})

//-----------------------Creating items by admin
//Creating item page
router.get('/create_item', (req, res) => {
        res.render('create_item', {
            title: 'Creating item'
        })
})

//Save creating item
router.post('/send_item', async (req, res) => {
    const poc = new item({
        name: req.body.Name,
        description: req.body.description,
        price: req.body.price,
        enabled: req.body.enabled,
        type: req.body.type
    })
    await poc.save()
    
    res.redirect('/admin_panel')
})

//-----------------------Shop
//Shop page
router.get('/shop', async (req,res) => {
    const massiv = await item.find({enabled: true}).lean()

    res.render('shop',{
        title: 'Shop',
        massiv,
    })
})

//Buy item
router.get('/buy', async (req,res) => {
    const { cookies } = req

    let now = new Date()
    id_item = req.query._id
    id_user = JSON.parse(cookies.UserData).id
    
    let item_info = await item.find({ _id: id_item }).lean()
    let user_info = await user.find({ _id: id_user}).lean()

    if (user_info[0].balance > item_info[0].price){
        await user.findByIdAndUpdate(id_user, {
            balance: user_info[0].balance - item_info[0].price
        })
    
        const poc = new purchase({
            user_id: id_user,
            item_id: id_item,
            price: item_info[0].price,
            date: now
        })
        await poc.save()
    
        res.redirect('/cab')
    }else{
        res.json({success:'false'})
    }
})

module.exports = router