const {Schema, model} = require('mongoose')

const user = new Schema({
    username:{
        type: String,
        unique: true,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    balance:{
        type: Number
    },
    roles:[{
        type: String,
        ref: 'role'
    }],
})

module.exports = model ('user', user)