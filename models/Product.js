const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    picture: {
        type: Buffer,
        required: true
    },
    price: {
        type: String,
        required: true
    }
})

module.exports = model('Product', schema)