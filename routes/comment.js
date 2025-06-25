const express = require('express');
const router = express.Router();

const { validateParamId, validateComment } = require('../middleware/validators');
const {
  getArticleComments,
  getProductComments,
  postArticleComment,
  postProductComment,
  patchComment,
  deleteComment
} = require('../controllers/commentController');

router.route('/')
  .get((req, res, next) => {
    if (req.commentType === 'articles') return getArticleComments(req, res);
    if (req.commentType === 'products') return getProductComments(req, res);
    next();
  })
  .post(validateComment, (req, res, next) => {
    if (req.commentType === 'articles') return postArticleComment(req, res);
    if (req.commentType === 'products') return postProductComment(req, res);
    next();
  });

router.route('/:commentId')
  .all(validateParamId)
  .patch(validateComment, patchComment)
  .delete(deleteComment);

module.exports = router;
