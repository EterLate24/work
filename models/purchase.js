const {Schema, model} = require('mongoose')

const purchase = new Schema({
    user_id:{
        type: String,
        required:true
    },
    item_id:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    date:{
        type: Date,
        required:true
    }

})

module.exports = model ('purchase', purchase)