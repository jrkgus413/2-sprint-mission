const { assert } = require("superstruct");
const { CreateArticleDto } = require("../dtos/article.dto");
const { CreateProductDto } = require('../dtos/product.dto');

const validateParamId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: '유효한 숫자 ID가 필요합니다.' });
  }
  req.validatedId = id;
  next();
};

const validateArticle = (req, res, next) => {
  try {
    assert(req.body, CreateArticleDto);
  } catch (err) {
    return res.status(400).json({ error: '유효하지 않은 입력 값입니다.', details: err.message });
  }
  next();
}

const validateProduct = (req, res, next) => {
  try {
    assert(req.body, CreateProductDto);
  } catch (err) {
    return res.status(400).json({ error: '유효하지 않은 입력 값입니다.', details: err.message });
  }
  next();
}

module.exports = {validateParamId, validateArticle, validateProduct };