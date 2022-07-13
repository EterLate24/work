const {Schema, model} = require('mongoose')

const item = new Schema({
    name:{
        type: String,
        unique: true,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    enabled:{
        type: Boolean,
        required:true
    },
    type:{
        type: String
    }

})

module.exports = model ('item', item)