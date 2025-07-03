const { db } = require('../utils/db');
const { getValidatedId, findArticle } = require('../utils/common');
const { handleError } = require('../utils/error');

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
    // 로그인 여부 확인
    if (!req.user) {
      return handleError(res, null, '로그인이 필요합니다.', 401);
    }

    const newArticle = await db.article.create({ 
      data: { 
        title, 
        content,
        userId: req.user.id 
      } 
    });

    res.status(201).json({ newArticle, message: '게시글이 등록되었습니다.' });
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
  const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
  
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
      take,
      select: { id: true, title: true, content: true, createdAt: true },
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
    // 게시글 ID로 게시글 조회
    const article = await findArticle(articleId, res);
    if (!article) return handleError(res, null, '게시글이 존재하지 않습니다.', 404);

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
  const articleId = getValidatedId(req.validatedId);
  const { title, content } = req.body;

  try {
    // 로그인 여부 확인
    if (!req.user) {
      return handleError(res, null, '로그인이 필요합니다.', 401);
    }

    const article = await db.article.findUnique({
      where: { id: articleId },
      include: { user: true }
    });
    
    // 게시글이 존재하는지 확인
    if (!article) {
      return handleError(res, null, '게시글이 존재하지 않습니다.', 404);
    }

    // 작성자 본인만 수정 가능
    if (article.userId !== req.user.id) {
      return handleError(res, null, '게시글 수정 권한이 없습니다.', 403);
    }

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
    // 로그인 여부 확인
    if (!req.user) {
      return handleError(res, null, '로그인이 필요합니다.', 401);
    }

    const article = await db.article.findUnique({
      where: { id: articleId },
      include: { user: true }
    });
    
    // 게시글이 존재하는지 확인
    if (!article) {
      return handleError(res, null, '게시글이 존재하지 않습니다.', 404);
    }

    // 작성자 본인만 삭제 가능
    if (article.userId !== req.user.id) {
      return handleError(res, null, '게시글 삭제 권한이 없습니다.', 403);
    }

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
