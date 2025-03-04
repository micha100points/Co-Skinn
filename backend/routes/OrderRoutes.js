const express = require("express");
const Order = require("../models/Order"); // Đường dẫn đến file định nghĩa mô hình Order

const router = express.Router();


// API tạo đơn hàng
router.post("/create", async (req, res) => {
  try {
    const { UserID, TotalAmount, ShippingAddress, PaymentMethod } = req.body;
    const newOrder = new Order({
      UserID,
      TotalAmount,
      ShippingAddress,
      PaymentMethod,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    // Trả về orderId và status
    return res.status(201).json({
      orderId: savedOrder._id, // MongoDB tự động tạo _id
      status: "success",
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({
      status: "failure",
      error: error.message,
    });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).exec();
    if (!order) {
      res.status(404).json({ message: "Đơn hàng không tồn tại" });
    } else {
      res.json(order);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng" });
  }
});

// PUT /api/orders/:id
router.put("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).exec();
    if (!order) {
      res.status(404).json({ message: "Đơn hàng không tồn tại" });
    } else {
      order.Status = req.body.Status;
      await order.save();
      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi sửa đơn hàng" });
  }
});

router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    // Build query object
    let query = {};

    // Search filter for OrderID or ShippingAddress
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { ShippingAddress: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.Status = status;
    }

    // Date range filter
    if (startDate && endDate) {
      query.OrderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Fetch and return filtered orders
    const orders = await Order.find(query).sort({ OrderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa đơn hàng theo ID
router.delete("/:id", async (req, res) => {
  const { orderId } = req.params;

  try {
      const order = await Order.findOneAndDelete({ OrderID: orderId });

      if (!order) {
          return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
      }

      res.status(200).json({ message: 'Đơn hàng đã được xóa thành công!', order });
  } catch (error) {
      res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đơn hàng.', error });
  }
});

module.exports = router;
