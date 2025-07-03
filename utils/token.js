const jwt = require('jsonwebtoken');
const { JWT_ACESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } = require('./const');

/**
 * @description JWT 토큰 생성 함수
 * @param {object} user 
 */
const createToken = (user) => {
  const payload = { userId: user.id };

  const accessToken = jwt.sign(payload, JWT_ACESS_SECRET, { expiresIn: '1h' });
  const refeshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refeshToken };
}

/**
 * @description JWT 액세스 토큰 검증 함수
 * @param {string} token 
 */
const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, JWT_ACESS_SECRET);
  return { userId: decoded.userId };
}

/**
 * @description JWT 리프레시 토큰 검증 함수
 * @param {string} token 
 */
const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  return { userId: decoded.userId };
}

/**
 * @description 쿠키에 토큰을 설정하는 함수
 * @param {object} res - Express 응답 객체
 * @param {string} accessToken - 액세스 토큰
 * @param {string} refeshToken - 리프레시 토큰
 */
const setCookie = (res, accessToken, refeshToken) => {
  // token option 
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  };
  // cookie에 AccessToken 저장
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { ...options, maxAge: 1 * 60 * 60 * 1000 });
  // cookie에 RefreshFToken 저장
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refeshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

module.exports = {
  createToken,
  verifyAccessToken,
  verifyRefreshToken,
  setCookie
};