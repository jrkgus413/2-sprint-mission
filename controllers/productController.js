const { db } = require('../utils/db');

/**
 * 상품 목록 조회 Controller
 * @queryParam offset number 페이지 번호
 * @queryParam limit number 페이지당 항목 수
 */
const getProduct = async (req, res, next) => {
  try {
    // 쿼리 파라미터 - offset, limit, order, search
    const queryParam = req.query;
    const offset = parseInt(queryParam.offset) || 0;
    const limit = parseInt(queryParam.limit) || 10;
    const order = queryParam.order || 'recent';
    const search = queryParam.search || '';

    // 검색 조건 설정
    let where =
      search
        ? { OR: [{ name: { contains: search }, description: { contains: search } }] }
        : {};

    // 조건에 따라 상품 목록 조회 
    const products = await db.product.findMany({
      where,
      orderBy: order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
      skip: offset,
      take: limit
    });
    
    const totalCount = await db.product.count({ where });
    // 페이지네이션 정보 추가
    const pagination = {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Math.floor(offset / limit) + 1,
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0
    };
    // 응답에 페이지네이션 정보 추가
    res.setHeader('X-Total-Pages', pagination.totalPages);
    res.status(200).json(products);
  } catch (error) {
    console.error('작업 중 오류 발생 :', error);
    res.status(500).json({ error: '작업 중 오류가 발생하였습니다' });
  }
}

/**
 * 상품 상세 조회 Controller
 * @queryParam id string 상품 ID
 */
const getProductById = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    }

    res.status(200).json(products);

  } catch (error) {
    console.error('작업 중 오류 발생 :', error);
    res.status(500).json({ error: '작업 중 오류가 발생하였습니다' });
  }
}

/** 상품 등록 Controller
 * @queryParam name string 상품 제목
 * @queryParam content string 상품 내용
 * @queryParam price number 상품 가격
 * @queryParam tags array 상품 태그
 */

const postProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const product = await db.product.create({
      data: { name, description, price, tags, }
    });

    res.status(201).json({ message: '상품이 등록되었습니다', id: product.id });
  } catch (error) {
    console.error('작업 중 오류 발생 :', error);
    res.status(500).json({ error: '작업 중 오류가 발생하였습니다' });
  }
}

/**
 * 상품 수정 Controller
 * @queryParam id string 상품 ID
 * @queryParam name string 상품 제목
 * @queryParam content string 상품 내용
 * @queryParam price number 상품 가격
 * @queryParam tags array 상품 태그
 */
const patchProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { name, description, price, tags } = req.body;
    const product = await db.product.update({
      where: { id: productId },
      data: { name, description, price, tags, updatedAt: new Date() }
    });

    if (!product) {
      return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    }

    res.status(200).json({ message: '상품이 변경되었습니다.', id: product.id });
  } catch (error) {
    console.error('작업 중 오류 발생 :', error);
    res.status(500).json({ error: '작업 중 오류가 발생하였습니다' });
  }
}

/**
 * 상품 삭제 Controller
 * @queryParam id string 상품 ID
 */
const deleteProduct = async (req, res, next) => {

  try {
    const productId = Number(req.params.id);
    if (!productId) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const existingProduct = await db.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    }

    const product = await db.product.delete({
      where: { id: productId }
    });
    res.status(200).json({ message: '상품이 삭제되었습니다.', id: product.id });

  } catch (error) {
    console.error('작업 중 오류 발생 :', error);
    res.status(500).json({ error: '작업 중 오류가 발생하였습니다' });
  }
}

module.exports = {
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};