const express = require("express");
const Category = require("../models/Category"); // Đường dẫn đến file Category.js

const router = express.Router();

// Lấy danh sách loại sản phẩm
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;  
    const products = await Category.find({ CategoryID: categoryId }); 
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm trong danh mục này." });
    }
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo danh mục", error: error.message });
  }
});

// Thêm loại sản phẩm mới
router.post("/add", async (req, res) => {
  try {
    const { CategoryID, CategoryName, Description } = req.body;

    // Kiểm tra nếu thiếu trường nào
    if ( !CategoryName || !Description) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ các trường dữ liệu." });
    }
    const lastCategory = await Category.findOne({}, "CategoryID")
      .sort({ CategoryID: -1 })
      .limit(1);
    const newCategoryID = lastCategory ? lastCategory.CategoryID + 1 : 1;

    // Tạo một đối tượng Category mới
    const newCategory = new Category({
      CategoryID: newCategoryID,
      CategoryName,
      Description,
    });

    // Lưu Category vào database
    await newCategory.save();
    res
      .status(201)
      .json({
        message: "Category đã được thêm thành công.",
        category: newCategory,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server. Không thể thêm Category.",
        error: error.message,
      });
  }
});

// Cập nhật thông tin loại sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { CategoryName, Description } = req.body;

    // Kiểm tra nếu thiếu trường nào
    if (!CategoryName || !Description) {
      return res
        .status(400)
        .json({
          message:
            "Vui lòng cung cấp đầy đủ các trường CategoryName và Description.",
        });
    }

    // Tìm và cập nhật Category
    const updatedCategory = await Category.findOneAndUpdate(
      { CategoryID: id },
      { CategoryName, Description },
      { new: true } // Trả về bản ghi đã cập nhật
    );

    // Kiểm tra nếu không tìm thấy Category với ID này
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category không tồn tại." });
    }

    res
      .status(200)
      .json({
        message: "Category đã được cập nhật thành công.",
        category: updatedCategory,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server. Không thể cập nhật Category.",
        error: error.message,
      });
  }
});

// Xóa loại sản phẩm
router.delete("/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const result = await Category.findOneAndDelete({ CategoryID: categoryId });
    if (!result) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }
    res.status(200).json({ message: "Loại sản phẩm đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
