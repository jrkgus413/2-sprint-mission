const { db } = require('../utils/db');
const { handleError } = require('../utils/error');
const { getValidatedId, findProduct } = require('../utils/common');
/**
 * @description 상품 등록
 * @route POST /products
 * 
 * @param {string} req.body.name - 상품 이름
 * @param {string} req.body.description - 상품 설명
 * @param {number} req.body.price - 상품 가격
 * @param {Array<string>} req.body.tags - 상품 태그
 * @param {string} req.body.imageUrl - 상품 이미지 URL
 */
const postProduct = async (req, res) => {
  const { name, description, price, tags, imageUrl } = req.body;

  try {
    if (!req.user) return handleError(res, null, '로그인이 필요합니다.', 401);

    const newProduct = await db.product.create({
      data: {
        name,
        description,
        price,
        tags,
        imageUrl,
        userId: req.user.id
      },
    });

    res.status(201).json({ newProduct, message: "상품이 등록되었습니다." });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 상품 목록 조회
 * @route GET /products
 * 
 * @param {number} req.query.offset - 조회 시작 위치 (기본값: 0)
 * @param {number} req.query.limit - 조회할 상품 수 (기본값: 10)
 * @param {string} req.query.order - 정렬 기준 (기본값: 'recent', 'asc' 또는 'desc')
 * @param {string} req.query.search - 검색어 (상품 이름 또는 설명에 포함된 경우)
 */
const getProduct = async (req, res) => {
  try {
    const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
    const skip = parseInt(offset, 10);
    const take = parseInt(limit, 10);

    const where = search
      ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
      : {};

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: order === 'recent' ? 'desc' : 'asc' },
      skip,
      take,
      select: { id: true, name: true, price: true, imageUrl: true, createdAt: true },
    });

    res.status(200).json({ products });
  } catch (error) {
    handleError(res, error);
  }
};

/**
  * @description 상품 ID로 상품 조회
  * @route GET /products/:id
  * 
  * @param {number} req.params.id - 조회할 상품 ID
 */
const getProductById = async (req, res) => {
  const productId = getValidatedId(req.validatedId);

  try {
    // 상품 ID로 상품 조회
    const product = await findProduct(productId, res);
    if (!product) return handleError(res, null, '상품이 존재하지 않습니다.', 404);

    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

/**
  * @description 상품 정보 수정
  * @route PATCH /products/:id
  * 
  * @param {number} req.params.id - 수정할 상품 ID
  * @param {string} req.body.name - 상품 이름
  * @param {string} req.body.description - 상품 설명
  * @param {number} req.body.price - 상품 가격
  * @param {Array<string>} req.body.tags - 상품 태그
  * @param {string} req.body.imageUrl - 상품 이미지 URL
 */
const patchProduct = async (req, res) => {
  const productId = getValidatedId(req.validatedId);
  const { name, description, price, tags, imageUrl } = req.body;

  try {
    if (!req.user) return handleError(res, null, '로그인이 필요합니다.', 401);

    // 상품이 존재하는지 확인
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product) return handleError(res, null, '상품이 존재하지 않습니다.', 404);

    // 상품 등록자만 수정 가능
    if (product.userId !== req.user.id) return handleError(res, null, '상품 수정 권한이 없습니다.', 403);

    // 상품이 존재할 경우 업데이트
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { name, description, price, tags, imageUrl },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 상품 삭제
 * @route DELETE /products/:id
 * 
 * @param {number} req.params.id - 삭제할 상품 ID
 */
const deleteProduct = async (req, res) => {
  const productId = getValidatedId(req.validatedId);

  try {
    if (!req.user) return handleError(res, null, '로그인이 필요합니다.', 401);

    // 상품 ID로 상품 조회
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product) return handleError(res, null, '상품이 존재하지 않습니다.', 404);

    // 상품 등록자만 삭제 가능
    if (product.userId !== req.user.id) return handleError(res, null, '상품 삭제 권한이 없습니다.', 403);

    // 상품이 존재할 경우 삭제
    await db.product.delete({ where: { id: productId } });
    res.status(204).json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};
