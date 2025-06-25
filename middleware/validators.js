const { assert } = require("superstruct");
const { handleError } = require("../utils/error");
const { CreateArticleDto } = require("../dtos/article.dto");
const { CreateProductDto } = require('../dtos/product.dto');
const { CreateCommentDto } = require('../dtos/comment.dto');

// 유효한 숫자 ID를 검증하는 미들웨어
const validateParamId = (req, res, next) => {
  const id = Number(req.params.id || req.params.commentId);

  if (!id || isNaN(id)) {
    return handleError(res, null, '유효하지 않은 ID입니다.', 400);
  }
  req.validatedId = id;
  next();
};

// Article의 입력 값을 검증하는 미들웨어
const validateArticle = (req, res, next) => {
  try {
    assert(req.body, CreateArticleDto);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}

// Product의 입력 값을 검증하는 미들웨어
const validateProduct = (req, res, next) => {
  // 타입 변환
  if (typeof req.body.price === 'string') {
    req.body.price = Number(req.body.price);
  }

  try {
    assert(req.body, CreateProductDto);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}

// Comment의 입력 값을 검증하는 미들웨어
const validateComment = (req, res, next) => {
  try {
    assert(req.body, CreateCommentDto);
  } catch (err) {
    return handleError(res, err, '유효하지 않은 입력 값입니다.', 400);
  }
  next();
}


module.exports = { validateParamId, validateArticle, validateProduct, validateComment };