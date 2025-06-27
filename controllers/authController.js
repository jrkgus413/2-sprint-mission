const { db } = require("../utils/db");
const { handleError } = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password");

/**
 * @description 사용자 회원가입
 * @route POST /auth/register
 *
 * @param {string} req.body.email - 사용자 email
 * @param {string} req.body.nickname - 사용자 nickname
 * @param {string} req.body.pawwsord - 사용자 pawwsord
 * @param {string} req.body.image - 사용자 image
 */
const register = async (req, res, next) => {
  const { email, nickname, password, image } = req.body;

  try {
    const duplicateEmail = await db.user.findUnique({ where: { email } });
    if (duplicateEmail) return handleError(res, null, "해당 이메일이 이미 존재합니다.", 400);

    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
        image
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ userWithoutPassword });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * @description 사용자 로그인
 * @route POST /auth/login
 *
 * @param {string} req.body.email - 사용자 email
 * @param {string} req.body.pawwsord - 사용자 pawwsord
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // email로 사용자 조회
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return handleError(res, null, "해당 사용자가 존재하지 않습니다.", 400);
    // 비밀번호 검증
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) return handleError(res, null, "비밀번호가 틀렸습니다.", 400);

    res.status(200).json({ msg: "로그인이 완료 되었습니다." });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * @description 사용자 로그아웃
 * @route POST /auth/logout
 *
 * @param {string} req.body.email - 사용자 email
 * @param {string} req.body.pawwsord - 사용자 pawwsord
 */
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ msg: "로그아웃이 완료 되었습니다." });
  } catch (error) {
    return handleError(res, error);
  }
}



module.exports = {
  register,
  login,
  logout
};