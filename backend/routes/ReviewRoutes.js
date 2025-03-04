const express = require('express');
const router = express.Router();
const Review = require('./models/review'); // Đường dẫn tới model review

// Lấy danh sách đánh giá theo productId
router.get('/Reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

console.log('Incoming review data:', req.body);

router.post('/Reviews', async (req, res) => {
    try {
      const { productId, userName, comment, rating } = req.body;
      if (!productId || !userName || !comment || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const newReview = new Review({ productId, userName, comment, rating });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error });
    }
  });
  
module.exports = router;
