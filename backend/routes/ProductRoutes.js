const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();

// Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// API lấy sản phẩm tương tự
router.get("/similar/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "ProductID không hợp lệ" });
    }

    const currentProduct = await Product.findOne({ ProductID: productId }).lean();
    if (!currentProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const similarProducts = await Product.find({
      CategoryID: currentProduct.CategoryID,
      ProductID: { $ne: currentProduct.ProductID }, // Loại bỏ sản phẩm hiện tại
    })
      .limit(10)
      .lean();

    if (similarProducts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm tương tự" });
    }

    res.json(similarProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tương tự:", error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm tương tự" });
  }
});

router.get("/page", async (req, res) => {
  try {
    // Lấy `page` và `limit` từ query string (có giá trị mặc định nếu không được cung cấp)
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 16; // Số sản phẩm mỗi trang
    const skip = (page - 1) * limit; // Số sản phẩm cần bỏ qua

    // Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // Lấy danh sách sản phẩm cho trang hiện tại
    const products = await Product.find().skip(skip).limit(limit);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalProducts / limit);

    // Trả về dữ liệu phân trang
    res.json({
      products,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const {
      ProductName,
      CategoryID,
      Price,
      Stock,
      Description,
      ImageURL,
      Status,
    } = req.body;

    // Tìm ProductID lớn nhất hiện tại
    const lastProduct = await Product.findOne({}, "ProductID")
      .sort({ ProductID: -1 })
      .limit(1);
    const newProductID = lastProduct ? lastProduct.ProductID + 1 : 1; // Nếu không có sản phẩm nào, bắt đầu từ 1

    // Kiểm tra CategoryID hợp lệ
    const category = await Category.findOne({ CategoryID });
    if (!category) {
      return res.status(400).json({ message: "CategoryID không hợp lệ." });
    }

    // Tạo đối tượng sản phẩm mới
    const newProduct = new Product({
      ProductID: newProductID, // Sử dụng ProductID tự động tăng
      ProductName,
      CategoryID, // Sử dụng CategoryID từ danh mục đã kiểm tra
      Price,
      Stock,
      Description,
      ImageURL,
      CreatedAt: new Date(), // Thời gian tạo sản phẩm
      Status: Status || "Available", // Mặc định là 'Available' nếu không có trạng thái được cung cấp
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thêm sản phẩm" });
  }
});
// Lấy chi tiết 1 san pham
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id); // Chuyển đổi id thành số nguyên
    const product = await Product.findOne({ ProductID: productId });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Lấy sản phẩm theo categoryId
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;  // Lấy CategoryID từ URL
    const products = await Product.find({ CategoryID: categoryId });  // Tìm sản phẩm theo CategoryID

    // Kiểm tra nếu không có sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm trong danh mục này." });
    }

    // Trả về danh sách sản phẩm
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo danh mục", error: error.message });
  }
});

// Cập nhật thông tin sản phẩm
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ProductID từ URL
  const updates = req.body; // Lấy dữ liệu cần cập nhật từ body request

  try {
    // Tìm sản phẩm theo ProductID và cập nhật dữ liệu
    const updatedProduct = await Product.findOneAndUpdate(
      { ProductID: id },
      updates,
      { new: true } // Trả về sản phẩm đã cập nhật sau khi update
    );

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    // Trả về sản phẩm đã cập nhật
    res.json({
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm.', error });
  }
});

// Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await Product.findOneAndDelete({ ProductID: productId });
    if (!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
