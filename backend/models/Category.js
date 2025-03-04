const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryID: {
        type: Number,
        auto: true,
        required: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
