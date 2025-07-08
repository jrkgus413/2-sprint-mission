const Prisma = require('../generated/prisma');
const db = new Prisma.PrismaClient();

module.exports = { db };