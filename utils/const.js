require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;
const JWT_ACESS_SECRET = process.env.JWT_ACESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME || 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh_token';

module.exports = {
  PORT,
  SALT_ROUNDS,
  JWT_ACESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME
};