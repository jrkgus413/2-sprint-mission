const { db } = require("../utils/db");
const { verifyAccessToken } = require("../utils/token");
const { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } = require("../utils/const");

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: '인증 정보가 없습니다.' });
  }

  try {
    // Token 정보에서 userId 추출
    const { userId } = verifyAccessToken(accessToken);
    console.log('인증된 사용자 데이터:', userId);
     // 요청 객체에 사용자 정보 추가
    req.user =await db.user.findUnique({ where: { id: userId } });
    next(); // 다음 미들웨어로 이동
  } catch (error) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = authenticate;