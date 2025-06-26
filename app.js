const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { PORT } = require('./utils/const');

// Express 앱 생성
const app = express();
// 라우터 설정
const indexRouter = require('./routes/index');


// CORS 설정
app.use(cors({
  origin: '*', // 모든 도메인 허용
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 HTTP 메소드
  allowedHeaders: ['Content-Type', 'Authorization'] // 허용할 헤더
}));

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("실행 완료");
});

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

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});


module.exports = app;
