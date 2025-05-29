const { assert } = require("superstruct");
const { CreateArticleDto } = require("../dtos/article.dto");
const { CreateProductDto } = require('../dtos/product.dto');

// 유효한 숫자 ID를 검증하는 미들웨어
const validateParamId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: '유효한 숫자 ID가 필요합니다.' });
  }
  req.validatedId = id;
  next();
};

// Article와 Product의 입력 값을 검증하는 미들웨어
// Article의 경우 CreateArticleDto를 사용하고, Product의 경우 CreateProductDto를 사용
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