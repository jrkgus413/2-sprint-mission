var express = require('express');
var router = express.Router();

const { validateProduct } = require('../middleware/validators');
const { getProduct, getProductById, postProduct, patchProduct, deleteProduct } = require('../controllers/productController');
const { validateParamId } = require('../middleware/validators');

router.route('/')
  .get(getProduct)
  .post(validateProduct, postProduct);

router.route('/:id')
  .get(validateParamId, getProductById)
  .patch(validateParamId, validateProduct, patchProduct)
  .delete(validateParamId, deleteProduct);

module.exports = router;
