const { db } = require('../utils/db');
const { getValidatedId } = require('../utils/common');
const { handleError } = require('../utils/error');

// 게시글 존재 확인 유틸 함수
const findArticle = async (id, res) => {
  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    res.status(404).json({ error: '게시글이 존재하지 않습니다.' });
    return null;
  }
  return article;
};

/**
 * @description 게시글 등록
 * @route POST /articles
 * 
 * @param {string} req.body.title - 게시글 제목
 * @param {string} req.body.content - 게시글 내용
 */
const postArticle = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newArticle = await db.article.create({ data: { title, content } });
    res.status(201).json({ newArticle, message: "게시글이 등록 되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @description 게시글 목록 조회
 * @route GET /articles
 *
 * @param {number} req.query.offset - 조회 시작 위치
 * @param {number} req.query.limit - 조회할 게시글 수
 * @param {string} req.query.order - 정렬 기준 (기본값: 'recent', 'asc' 또는 'desc')
 * @param {string} req.query.search - 검색어 (게시글 제목 또는 내용에 포함된 경우)
 */
const getArticle = async (req, res) => {
  const { offset, limit, order = 'recent', search = '' } = req.query;
  try {
    const skip = parseInt(offset, 10);
    const take = parseInt(limit, 10);
    let where = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : {};
    const articles = await db.article.findMany({
      where,
      orderBy: order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
      skip,
      take
    });
    res.status(200).json(articles);
  } catch (error) {
    handleError(res, error);
  }
};

/** 
 * @description 게시글 ID로 상세 조회
 * @route GET /articles/:id
 * 
 * @param {string} req.params.id - 게시글 ID
 */
const getArticleById = async (req, res) => {
  const articleId = getValidatedId(req.validatedId);

  try {
    const article = await findArticle(articleId, res);
    if (!article) return;

    res.status(200).json(article);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @description 게시글 정보 수정
 * @route PATCH /articles/:id
 * 
 * @param {string} req.params.id - 게시글 ID
 * @param {string} req.body.title - 게시글 제목
 * @param {string} req.body.content - 게시글 내용
 */
const patchArticle = async (req, res) => {
  const articleId = getValidatedId(req.params.id);
  const { title, content } = req.body;

  try {
    const existingArticle = await findArticle(articleId, res);
    if (!existingArticle) return;

    const updateArticle = await db.article.update({
      where: { id: articleId },
      data: { title, content, updatedAt: new Date() }
    });
    res.status(200).json(updateArticle);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @description 게시글 삭제
 * @route DELETE /articles/:id
 * 
 * @param {string} req.params.id - 게시글 ID
 */
const deleteArticle = async (req, res) => {
  const articleId = getValidatedId(req.validatedId);

  try {
    const existingArticle = await findArticle(articleId, res);
    if (!existingArticle) return;

    await db.article.delete({ where: { id: articleId } });
    res.status(204).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getArticle,
  getArticleById,
  postArticle,
  patchArticle,
  deleteArticle,
};
