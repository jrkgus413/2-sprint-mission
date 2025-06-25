const express = require('express');
const router = express.Router();
const commentsRouter = require('./comment');

const { validateParamId, validateProduct } = require('../middleware/validators');
const { getProduct, getProductById, postProduct, patchProduct, deleteProduct } = require('../controllers/productController');

router.route('/')
  .get(getProduct)
  .post(validateProduct, postProduct);

router.route('/:id')
  .all(validateParamId)
  .get(getProductById)
  .patch(validateProduct, patchProduct)
  .delete(deleteProduct);

// product 관련 comment router
router.use(
  '/:id/comments',
  validateParamId,
  (req, res,  next) => { req.commentType = 'products'; next(); },
  commentsRouter
);

module.exports = router;
