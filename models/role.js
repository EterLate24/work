const {Schema, model} = require('mongoose')

const role = new Schema({
    value:{
        type: String,
        unique: true,
        default: 'USER'
    }
})

module.exports = model ('role', role)