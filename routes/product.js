var express = require('express');
var router = express.Router();

const { validateProduct } = require('../middleware/validateProduct');
const { getProduct, getProductById, postProduct, patchProduct, deleteProduct } = require('../controllers/productController');

router.route('/')
  .get(getProduct)
  .post(validateProduct, postProduct);

router.route('/:id')
  .get(getProductById)
  .patch(validateProduct, patchProduct)
  .delete(deleteProduct);

module.exports = router;
