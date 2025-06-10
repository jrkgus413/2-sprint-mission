var express = require('express');
var router = express.Router();

const { validateParamId, validateComment } = require('../middleware/validators');
const {
  getArticleComments,
  getProductComments,
  postArticleComment,
  postProductComment,
  patchComment,
  deleteComment
} = require('../controllers/commentController');

router.route('/article/:relationId')
  .all(validateParamId)
  .get(getArticleComments)
  .post(validateComment, postArticleComment);

router.route('/product/:relationId')
  .all(validateParamId)
  .get(getProductComments)
  .post(validateComment, postProductComment);

router.route('/:id')
  .all(validateParamId)
  .patch(validateComment, patchComment)
  .delete(deleteComment);

module.exports = router;
