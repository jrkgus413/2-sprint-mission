const express = require('express');
const router = express.Router();
const { validateParamId } = require('../middleware/validators');
const { patchUserPassword, getProductByUser, patchUserInfo, getUserInfo } = require('../controllers/userController');

router.route('/:id')
  .all(validateParamId)
  .get(getUserInfo)
  .patch(patchUserInfo);

router.route('/:id/password')
  .all(validateParamId)
  .patch(patchUserPassword);

router.route('/:id/products')
  .all(validateParamId)
  .patch(getProductByUser);

module.exports = router;
