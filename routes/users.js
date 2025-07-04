const express = require('express');
const router = express.Router();
const { validateParamId } = require('../middleware/validators');
const { patchUserPassword, getProductByUser, patchUserInfo, getUserInfo, getLikeProductByUser, getLikeArticleByUser, getArticleByUser } = require('../controllers/userController');

router.route('/:id')
  .all(validateParamId)
  .get(getUserInfo)
  .patch(patchUserInfo);

router.route('/:id/password')
  .all(validateParamId)
  .patch(patchUserPassword);

router.route('/:id/products')
  .all(validateParamId)
  .get(getProductByUser);

router.route('/:id/articles')
  .all(validateParamId)
  .get(getArticleByUser);

router.route('/:id/like-products')
  .all(validateParamId)
  .get(getLikeProductByUser);

router.route('/:id/like-articles')
  .all(validateParamId)
  .get(getLikeArticleByUser);

module.exports = router;
