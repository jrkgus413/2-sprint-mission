const { db } = require('../utils/db');
const { findArticle, findProduct, getValidatedId } = require('../utils/common');
const { handleError } = require('../utils/error');

// 댓글 존재 여부 확인
const findComment = async (commentId, res) => {
  const comment = await db.comment.findUnique({ where: { id: commentId } });
  if (comment === null) {
    handleError(res, null, '댓글이 존재하지 않습니다.', 404);
    return null;
  }
  return comment;
}

/**
 * @description 게시글 댓글 등록
 * @route POST /articles/:id/comments
 * 
 * @param {string} req.params.relationId - 게시글 ID
 * @param {string} req.body.content - 댓글 내용
 */
const postArticleComment = async (req, res) => {
  const relationId = getValidatedId(req.validatedId);
  const { content } = req.body;

  try {
    // 게시글 ID로 게시글 조회
    const article = await findArticle(relationId, res);
    if (!article) return;

    // 게시글이 존재하는 경우 댓글 등록
    const comment = await db.comment.create({
      data: {
        content,
        articleId: relationId
      }
    })
    res.status(201).json({ comment, message: "댓글이 등록되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 상품 댓글 등록
 * @route POST /products/:id/comments
 * 
 * @param {string} req.params.id - 상품 ID
 * @param {string} req.body.content - 댓글 내용
 */
const postProductComment = async (req, res) => {
  const relationId = getValidatedId(req.validatedId);
  const { content } = req.body;

  try {
    // 상품 ID로 게시글 조회
    const product = await findProduct(relationId, res);
    if (!product) return;

    // 상품이 존재하는 경우 댓글 등록
    const comment = await db.comment.create({
      data: {
        content,
        productId: relationId
      },
    })
    res.status(201).json({ comment, message: "댓글이 등록되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 게시글 댓글 조회
 * @route GET /articles/:id/comments
 * 
 * @param {string} req.params.relationId - 게시글 ID
 * @param {Object} req.query.cursor - 페이지네이션을 위한 커서
 * @param {number} req.query.take - 조회할 댓글 수 (기본값: 10)
 * 
 */
const getArticleComments = async (req, res) => {
  const { cursor, take = 10 } = req.query;
  const relationId = getValidatedId(req.validatedId);

  try {
    // 게시글 ID로 게시글 조회
    const article = await findArticle(relationId, res);
    if (!article) return;

    // 게시글이 존재하는 경우 댓글 조회
    const comments = await db.comment.findMany({
      where: { articleId: relationId },
      take: Number(take),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
    res.status(200).json({ comments });
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * @description 상품 댓글 조회
 * @route GET /products/:id/comments
 * 
 * @param {string} req.params.relationId - 게시글 ID
 * @param {Object} req.query.cursor - 페이지네이션을 위한 커서
 * @param {number} req.query.take - 조회할 댓글 수 (기본값: 10)
 */
const getProductComments = async (req, res) => {
  const { cursor, take = 10 } = req.query;
  const relationId = getValidatedId(req.validatedId);

  try {
    // 상품 ID로 게시글 조회
    const product = await findProduct(relationId, res);
    if (!product) return;

    // 상품이 존재하는 경우 댓글 조회
    const comments = await db.comment.findMany({
      where: { productId: relationId },
      take: Number(take),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
    res.status(200).json({ comments });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 댓글 수정
 * @route PATCH :commetType/:id/comments/:commentId
 * 
 * @param {string} req.params.id - 댓글 ID
 * @param {string} req.body.content - 수정할 댓글 내용
 */
const patchComment = async (req, res) => {
  const commentId = getValidatedId(req.validatedId);
  const { content } = req.body;

  try {
    // 댓글 ID로 댓글 조회
    const comment = await findComment(commentId, res);
    if (!comment) return;

    // 댓글이 존재하는 경우 수정
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: { content }
    });
    res.status(200).json({ updatedComment, message: "댓글이 수정되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * @description 댓글 삭제
 * @route DELETE :commetType/:id/comments/:id
 * 
 * @param {string} req.params.id - 삭제할 댓글 ID
 */
const deleteComment = async (req, res) => {
  const commentId = getValidatedId(req.validatedId);

  try {
    // 댓글 ID로 댓글 조회
    const comment = await findComment(commentId, res);
    if (!comment) return;

    // 댓글이 존재하는 경우 삭제
    await db.comment.delete({ where: { id: commentId } });
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
}


module.exports = {
  postArticleComment,
  postProductComment,
  getArticleComments,
  getProductComments,
  patchComment,
  deleteComment
};