require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

module.exports = { PORT, SALT_ROUNDS };