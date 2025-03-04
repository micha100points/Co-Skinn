// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// API: Lấy toàn bộ giỏ hàng của người dùng
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ UserID: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Thêm sản phẩm vào giỏ hàng
router.post("/add/:userId", async (req, res) => {
  console.log("Req body:", req.body);
  console.log("UserID:", req.params.userId);

  try {
    const { ProductID, Quantity, Price } = req.body;

    // Kiểm tra xem tất cả các giá trị có tồn tại trong req.body không
    if (!ProductID  || !Quantity || !Price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ UserID: req.params.userId });

    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại cho user này, tạo mới
      cart = new Cart({
        UserID: req.params.userId,
        Products: [{ ProductID, Quantity, Price }],
      });
    } else {
      // Kiểm tra nếu sản phẩm đã tồn tại, cập nhật số lượng
      const productIndex = cart.Products.findIndex((p) => p.ProductID === ProductID);
      if (productIndex > -1) {
        cart.Products[productIndex].Quantity += Quantity;
      } else {
        cart.Products.push({ ProductID, Quantity, Price });
      }

      const productName = await Product.findOne({ ProductID }, "ProductName");
      if (productName) {
        cart.Products[cart.Products.length - 1].ProductName = productName.ProductName;
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// PUT API để cập nhật giỏ hàng
router.put('/update-quantity', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Kiểm tra nếu `quantity` là số hợp lệ và lớn hơn 0
  if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0.' });
  }

  try {
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ UserID: userId });
      
      if (!cart) {
          return res.status(404).json({ error: 'Cart not found.' });
      }

      // Tìm sản phẩm trong giỏ hàng
      const product = cart.Products.find(p => p.ProductID === productId);
      
      if (!product) {
          return res.status(404).json({ error: 'Product not found in cart.' });
      }

      // Cập nhật số lượng sản phẩm
      product.Quantity = quantity;

      // Lưu lại giỏ hàng đã cập nhật
      await cart.save();

      return res.status(200).json({ message: 'Product quantity updated successfully.', cart });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while updating the cart.' });
  }
});


// API: Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { UserID: userId },
      { $pull: { Products: { ProductID: productId } } },
      { new: true }
    );

    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    if (cart.Products.length === 0)
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
