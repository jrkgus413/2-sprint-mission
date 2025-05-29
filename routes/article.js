var express = require('express');
var router = express.Router();

const { validateParamId, validateArticle } = require('../middleware/validators');
const { getArticle, getArticleById, postArticle, patchArticle, deleteArticle } = require('../controllers/articleController');

router.route('/')
  .get(getArticle)
  .post(validateArticle, postArticle);

router.route('/:id')
  .all(validateParamId)
  .get(getArticleById)
  .patch(validateArticle, patchArticle)
  .delete(deleteArticle);

module.exports = router;
