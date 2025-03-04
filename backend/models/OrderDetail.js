const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    OrderDetailID: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        required: true
    },
    OrderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    }
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;
