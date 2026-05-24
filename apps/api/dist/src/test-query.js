"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
// Prisma 7 adaptör bağlantımız
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: "postgresql://postgres:password@localhost:5432/cafeflow?schema=public",
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🔍 Harput Merkez Kafe veritabanında aranıyor...');
    // İşletmeleri ve onlara bağlı şubeleri çekiyoruz
    const businesses = await prisma.business.findMany({
        include: {
            branches: true, // Şubeleri de getir
        },
    });
    console.log('✅ Bulunan Veriler:');
    console.dir(businesses, { depth: null });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
