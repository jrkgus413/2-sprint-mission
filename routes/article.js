const express = require('express');
const router = express.Router();
const commentsRouter = require('./comment');
const likeRouter = require('./like');

const { validateParamId, validateArticle } = require('../middleware/validators');
const { getArticle, getArticleById, postArticle, patchArticle, deleteArticle } = require('../controllers/articleController');
const authenticate = require('../middleware/authenticate');
// 
router.route('/')
  .get(getArticle)
  .post(authenticate, validateArticle, postArticle);

router.route('/:id')
  .all(validateParamId)
  .get(getArticleById)
  .patch(authenticate, validateArticle, patchArticle)
  .delete(authenticate, deleteArticle);

// article 관련 comment router
router.use(
  '/:id/comments',
  validateParamId,
  (req, res, next) => { req.relationType = 'articles'; next(); },
  commentsRouter
);

// article 관련 like router
router.use(
  '/:id/like',
  validateParamId,
  (req, res, next) => { req.relationType = 'articles'; next(); },
  likeRouter
);

module.exports = router;
