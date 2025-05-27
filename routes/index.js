var express = require('express');
var router = express.Router();

/* GET Health check */
router.get('/', (req, res, next) => {
  res.send('OK');
});

module.exports = router;
