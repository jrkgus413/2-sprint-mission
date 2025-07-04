const { db } = require('../utils/db');
const { handleError } = require('../utils/error');

// 유효한 ID 확인
const getValidatedId = (validatedId) => {
  const validationId = Number(validatedId);

  if (!validatedId || isNaN(validatedId)) {
    throw new Error('유효하지 않은 ID 입니다.');
  }

  return validationId;
};

// 게시글 존재 여부 확인
const findArticle = async (articleId, res) => {
  const article = await db.article.findUnique({
    where: { id: parseInt(articleId, 10) },
    include: {
      user: {
        select: { id: true, nickname: true, image: true } // 작성자 정보 포함
      },
      _count: {
        select: { isLiked: true } // 좋아요 수 포함
      }
    }
  });

  return article;
}

// 상품 존재 여부 확인
const findProduct = async (productId, res) => {
  const product = await db.product.findUnique({
    where: { id: parseInt(productId, 10) },
    // select: { id: true, name: true, price: true, imageUrl: true, createdAt: true },
    include: {
      user: {
        select: { id: true, nickname: true, image: true } // 작성자 정보 포함
      },
      _count: {
        select: { isLiked: true } // 좋아요 수 포함
      }
    }
  });

  return product;
}

module.exports = {
  getValidatedId,
  findArticle,
  findProduct
};