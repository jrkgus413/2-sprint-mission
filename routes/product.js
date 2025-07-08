const express = require('express');
const router = express.Router();
const commentsRouter = require('./comment');
const likeRouter = require('./like');

const { validateParamId, validateProduct } = require('../middleware/validators');
const { getProduct, getProductById, postProduct, patchProduct, deleteProduct } = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');

router.route('/')
  .get(getProduct)
  .post(authenticate, validateProduct, postProduct);

router.route('/:id')
  .all(validateParamId)
  .get(getProductById)
  .patch(authenticate, validateProduct, patchProduct)
  .delete(authenticate, deleteProduct);

// product 관련 comment router
router.use(
  '/:id/comments',
  validateParamId,
  (req, res, next) => { req.relationType = 'products'; next(); },
  commentsRouter
);

// product 관련 like router
router.use(
  '/:id/like',
  validateParamId,
  (req, res, next) => { req.relationType = 'products'; next(); },
  likeRouter
);

module.exports = router;
