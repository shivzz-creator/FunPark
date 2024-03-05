const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    }
},{ timestamps: true });
module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
