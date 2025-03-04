const mongoose = require('mongoose');
const Category = require('./Category');

const productSchema = new mongoose.Schema({
    ProductID: {
        type: Number,
        auto: true,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    CategoryID: {
        type: Number,
        ref: 'Category',
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Stock: {
        type: Number,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    ImageURL: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        default: 'Available'
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
