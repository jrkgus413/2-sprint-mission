const { assert } = require('superstruct');
const { CreateProductDto } = require('../dtos/product.dto');

const validateProduct = (req, res, next) => {
  try {
    assert(req.body, CreateProductDto);
  } catch (err) {
    return res.status(400).json({ error: '유효하지 않은 입력 값입니다.', details: err.message });
  }
  next();
}

module.exports = { validateProduct };