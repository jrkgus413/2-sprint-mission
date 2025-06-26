
const { db } = require('../utils/db');
const { handleError } = require('../utils/error');
const { getValidatedId } = require('../utils/common');

/** 
 * @description 사용자 Id를 통해 사용자 DB 정보 조회 
 * 
 * @param {string} id - 사용자 id
*/
const findUserById = async (id) => {
  const userInfo = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      email: true,
      image: true,
      password: false
    }
  });

  return userInfo;
}
/**
 * @description 사용자 정보 조회 
 * @route GET /article/:id/comments
 *
 * @param {string} req.params.userId - 사용자 id
 */
const getUserInfo = async (req, res, next) => {
  const id = getValidatedId(req.validatedId);

  try {
    const userInfo = await findUserById(id);
    if (!userInfo) return handleError(res, null, "사용자가 존재하지 않습니다", 404);
    res.status(500).json(userInfo);
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * @description 사용자 정보 수정
 * @route GET /article/:id/comments
 *
 * @param {string} req.params.userId - 사용자 id
 * @param {string} req.body.email - 사용자 이메일
 * @param {string} req.body.nickname - 서용자 닉네임
 * @param {string} req.body.image - 사용자 프로필 사진
 */
const patchUserInfo = async (req, res, next) => {
  const id = getValidatedId(req.validatedId);
  const { email, nickname, image } = req.params;

  try {
    const userInfo = await findUserById(id);

    if (!userInfo) return handleError(res, null, "사용자가 존재하지 않습니다", 404);

    const updateUser = await db.user.update({
      where: { id },
      data: {
        email,
        nickname,
        image
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        image: true,
        password: false
      }
    })

    res.status(200).json(updateUser);
  } catch (error) {
    return handleError(res, error);
  }
}
/**
 * @description 사용자 비밀번호 수정
 * @route GET /article/:id/comments
 *
 * @param {string} req.params.userId - 사용자 id
 * @param {string} req.body.password - 사용자 비밀번호
 */
const patchUserPassword = async (req, res, next) => {
  const id = getValidatedId(req.validatedId);
  const { password } = req.params;

  try {
    const userInfo = await findUserById(id);
    if (!userInfo) return handleError(res, null, "사용자가 존재하지 않습니다", 404);
    
    await db.user.update({
      where: { id },
      data: { password },
    })

    res.status(200).json()
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * @description 자신이 등록한 상품 목록 조회
 * @route GET /users/:id/products
 *
 * @param {string} req.params.userId - 사용자 id
 */
const getProductByUser = async (req, res, next) => {
  const id = getValidatedId(req.validatedId);

  try {
    const userInfo = await findUserById(id);

    if (!userInfo) return handleError(res, null, "사용자가 존재하지 않습니다", 404);

    const products = await db.product.findMany({
      where: {
        userId: id,
      }
    })

    res.status(200).json(products)
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  getUserInfo,
  patchUserInfo,
  patchUserPassword,
  getProductByUser
}