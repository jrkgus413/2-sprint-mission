const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload');

// POST /files/image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 업로드 실패' });
  }
  // storage에서 파일명과 확장자까지 이미 처리했으므로 rename 불필요
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;