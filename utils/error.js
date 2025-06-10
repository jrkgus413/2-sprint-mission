// 공통 에러 응답 함수
const handleError = (res, error, message = '작업 중 오류가 발생하였습니다', status = 500) => {
  console.error(message, error);
  res.status(status).json({ error: message });
}

module.exports = {
  handleError,
};