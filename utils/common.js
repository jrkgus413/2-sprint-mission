const { db } = require('../utils/db');
const { handleError } = require('../utils/error');

// 유효한 ID 확인
const getValidatedId = (validatedId) => {
  if (!validatedId) {
    throw new Error('유효하지 않은 ID 입니다.');
  }
  return validatedId;
};

// 게시글 존재 여부 확인
const findArticle = async (articleId, res) => {
  const article = await db.article.findUnique({
    where: { id: parseInt(articleId, 10) },
    select: { id: true, title: true, content: true, createdAt: true }
  });
  if (article === null) {
    handleError(res, null, '게시글이 존재하지 않습니다.', 404);
    return null;
  }
  return article;
}

// 상품 존재 여부 확인
const findProduct = async (productId, res) => {
  const product = await db.product.findUnique({
    where: { id: parseInt(productId, 10) },
    select: { id: true, name: true, price: true, imageUrl: true, createdAt: true }
  });
  if (product === null) {
    handleError(res, null, '상품이 존재하지 않습니다.', 404);
    return null;
  }
  return product;
}

module.exports = {
  getValidatedId,
  findArticle,
  findProduct
};