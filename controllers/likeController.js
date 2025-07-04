const { db } = require("../utils/db");
const { handleError } = require("../utils/error");
const { getValidatedId } = require("../utils/common");

/**
 * @description 사용자가 특정 상품이나 게시글에 좋아요를 눌렀는지 확인
 *
 * @param {Object} req - 요청 객체
 */
const findIsLiked = async (req) => {
  const { id: userId } = req.user;
  const relationType = req.relationType; // 상품인지 게시글인지
  const relationId = getValidatedId(req.validatedId); // 연관 id

  const isLiked = await db.like.findFirst({
    where: {
      articleId: relationType === 'articles' ? relationId : null,
      productId: relationType === 'products' ? relationId : null,
      userId
    }
  });
  return isLiked;
}

/**
 * @description 좋아요 추가 또는 취소
 * @route POST :relationType/:id/like
 * 
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
const toggleLike = async (req, res) => {
  const { id: userId } = req.user;
  const relationType = req.relationType; // 상품인지 게시글인지
  const relationId = getValidatedId(req.validatedId); // 연관 id

  try {
    if (!req.user) return handleError(res, null, '로그인이 필요합니다.', 401);

    const isLiked = await findIsLiked(req);
    // 좋아요 상태에 따라 추가 또는 취소
    if (!isLiked) {
      // 좋아요 추가 로직
      await db.like.create({
        data: {
          userId,
          articleId: relationType === 'articles' ? relationId : null,
          productId: relationType === 'products' ? relationId : null
        },
      });
    } else {
      // 좋아요 취소 로직
      await db.like.delete({ where: { id: isLiked.id } });
    }

    res.status(201).json({ message: isLiked ? '좋아요가 취소되었습니다.' : '좋아요가 추가되었습니다.' });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  toggleLike
};