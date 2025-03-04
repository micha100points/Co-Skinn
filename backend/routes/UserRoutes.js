const express = require("express");
const User = require("../models/User"); // Đường dẫn đến file User.js
const router = express.Router();
const Cart = require("../models/Cart");
// Lấy danh sách người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm người dùng mới
router.post("/add", async (req, res) => {
  try {
    const { Username, Password, Email, Phone, Address, Role } = req.body;

    // Tìm UserID lớn nhất hiện tại
    const lastUser = await User.findOne({}, "UserID")
      .sort({ UserID: -1 })
      .limit(1);
    const newUserID = lastUser ? lastUser.UserID + 1 : 1; // Nếu không có người dùng nào, bắt đầu từ 1

    // Tạo đối tượng người dùng mới
    const newUser = new User({
      UserID: newUserID, // Sử dụng UserID tự động tăng
      Username,
      Password,
      Email,
      Phone,
      Address,
      Role,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ Email: Email });
    console.log("Tìm thấy người dùng:", user); // Log người dùng tìm thấy

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }

    if (Password !== user.Password) {
      return res.status(400).json({ message: "Mật khẩu không đúng." });
    }

    // Kiểm tra giỏ hàng
    const cart = await Cart.findOne({ UserID: user.UserID });
    let userCartCount = 0; // Mặc định là 0 nếu không có giỏ hàng

    if (cart && cart.Products) {
      userCartCount = cart.Products.reduce(
        (total, product) => total + product.Quantity,
        0
      );
    }

    const { UserID, Username, Role } = user;
    res.json({
      message: "Đăng nhập thành công",
      UserID,
      Username,
      Role,
      userCartCount,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập." });
  }
});


// Lấy thông tin người dùng theo ID
router.get("/getUser/:id", async (req, res) => {
  try {
    console.log(req.params);
    const userId = parseInt(req.params.id);
    const user = await User.findOne({ UserID: userId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy user với UserID này." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi tìm user:", error);
    res.status(500).json({ message: error });
  }
});

// Lấy tất cả thông tin theo UserID
router.get("/details/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Tìm thông tin người dùng theo UserID
    const user = await User.findOne({ UserID: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm thông tin giỏ hàng liên quan đến UserID
    const cart = await Cart.findOne({ UserID: userID });

    // Tạo response bao gồm cả thông tin người dùng và giỏ hàng
    const userDetails = {
      user,
      cart: cart || { message: "No cart found for this user" }, // Nếu không có giỏ hàng, trả về thông báo
    };

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
});
// Cập nhật thông tin người dùng qua UserID
router.put("/edit/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Tìm và cập nhật thông tin người dùng theo UserID
    const updatedUser = await User.findOneAndUpdate(
      { UserID: userID }, // Tìm người dùng theo UserID
      req.body, // Dữ liệu cần cập nhật từ body request
      { new: true, runValidators: true } // Tùy chọn trả về dữ liệu đã cập nhật và kiểm tra validation
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});



// Cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa người dùng
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
