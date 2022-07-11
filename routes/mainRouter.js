const { Router } = require('express')
const { route } = require('express/lib/application')
const router = Router()
const { response } = require('express')



// Главная
router.get('/', async (req, res) => {

    res.render('index', {
        title: 'EterService - главная',
        home: true
    })
})



module.exports = router