const express = require('express');
const router = express.Router();

const authRouter = require('./auth')
const usersRouter = require('./users');
const articlesRouter = require('./article');
const productsRouter = require('./product');
const fileRouter = require('./file');

/* GET Health check */
router.get('/', (req, res, next) => { res.send('OK'); });
/* auth 관련 라우터 */
router.use('/auth', authRouter);
/* users 관련 라우터 */
router.use('/users', usersRouter);
/* articles 관련 라우터 */
router.use('/articles', articlesRouter);
/* products 관련 라우터 */
router.use('/products', productsRouter);
/* files 관련 라우터 */
router.use('/files', fileRouter);

module.exports = router;
