var express = require('express');
var router = express.Router();

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

module.exports = router;
