const express = require('express');
const router = express.Router();

/* GET Health check */
router.get('/', (req, res, next) => {
  res.send('OK');
});

module.exports = router;
