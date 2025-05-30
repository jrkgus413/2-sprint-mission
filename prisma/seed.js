const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const sample = require('./sampleData');

const main = async () => {
  console.log('DB 시딩 시작')
  // 기존 데이터 삭제;
  await prisma.comment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});

  // 시딩 데이터 삽입
  await prisma.product.createMany({ data: sample.products });
  await prisma.article.createMany({ data: sample.articles });
  await prisma.comment.createMany({ data: sample.comments });
};

main()
  .then(() => {
    console.log('DB 시딩 완료');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });