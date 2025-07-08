const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

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
    if (req.relationType === 'articles') return getArticleComments(req, res);
    if (req.relationType === 'products') return getProductComments(req, res);
    next();
  })
  .post(authenticate, validateComment, (req, res, next) => {
    if (req.relationType === 'articles') return postArticleComment(req, res);
    if (req.relationType === 'products') return postProductComment(req, res);
    next();
  });

router.route('/:commentId')
  .all(authenticate, validateParamId)
  .patch(validateComment, patchComment)
  .delete(deleteComment);

module.exports = router;
