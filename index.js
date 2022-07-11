const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const routes = require('./routes/mainRouter')
const path = require('path')
const { use } = require('express/lib/router')
const cookieParser = require('cookie-parser')

const PORT =  2000

const app = express()
const hbs = exphbs.create({
    defaultLayout:'main',
    extname:'hbs'
})

app.use(cookieParser())
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended:true}))

app.use(routes)

async function start() {
    try{
        await mongoose.connect('mongodb+srv://eterlate:06122000@cluster0.jv3dk.mongodb.net/test',{
            useNewUrlParser: true 
        })
        app.listen(PORT, ()=>{
            console.log(`Server has been started on port ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}
start()