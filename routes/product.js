const express = require('express');
const router = express.Router();
const commentsRouter = require('./comment');

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
  (req, res, next) => { req.commentType = 'products'; next(); },
  commentsRouter
);

module.exports = router;
