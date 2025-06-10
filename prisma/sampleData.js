module.exports = {
  products: [
    {
      id: 1,
      name: '노트북',
      description: '최신형 노트북입니다.',
      price: 1200000,
      tags: ['전자기기', '노트북'],
      imageUrl: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: '책상',
      description: '튼튼한 책상입니다.',
      price: 50000,
      tags: ['가구'],
      imageUrl: 'https://example.com/desk.jpg',
    },
    {
      id: 3,
      name: '의자',
      description: '편안한 의자입니다.',
      price: 30000,
      tags: ['가구', '의자'],
      imageUrl: 'https://example.com/chair.jpg',
    },
  ],
  articles: [
    {
      id: 1,
      title: '첫 번째 게시글',
      content: '안녕하세요, 첫 글입니다!',
    },
    {
      id: 2,
      title: '두 번째 게시글',
      content: '테스트용 게시글입니다.',
    },
    {
      id: 3,
      title: '세 번째 게시글',
      content: '더 많은 예시 데이터를 추가해봅니다.',
    },
  ],
  comments: [
    {
      content: '좋은 상품이네요!',
      productId: 1,
    },
    {
      content: '흥미로운 글입니다.',
      articleId: 1,
    },
    {
      content: '의자도 좋아보여요!',
      productId: 3,
    },
  ],
};