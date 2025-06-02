var createError = require('http-errors');
const express = require('express');
var logger = require('morgan');
var cors = require('cors');
// Express 앱 생성
var app = express();
// 라우터 설정
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/article');
var productsRouter = require('./routes/product');
var commentsRouter = require('./routes/comment');
var fileRouter = require('./routes/file');

// CORS 설정
app.use(cors({
  origin: '*', // 모든 도메인 허용
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 HTTP 메소드
  allowedHeaders: ['Content-Type', 'Authorization'] // 허용할 헤더
}));

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/files', fileRouter);

app.use('/uploads', express.static('uploads'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({error : err.message}); 
});

module.exports = app;
