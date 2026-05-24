"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
// Prisma 7'nin zorunlu kıldığı yeni adaptör (bağlantı) yapısı
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: "postgresql://postgres:password@localhost:5432/cafeflow?schema=public",
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Veritabanına can suyu veriliyor...');
    // 1. Örnek İşletme
    const business = await prisma.business.create({
        data: {
            name: 'Harput Merkez Kafe',
            slug: 'harput-merkez-kafe',
            phone: '05551112233',
            address: 'Elazığ Merkez',
        },
    });
    // 2. Şube
    const branch = await prisma.branch.create({
        data: {
            businessId: business.id,
            name: 'Ana Şube',
        },
    });
    // 3. Sistem Yöneticisi
    const admin = await prisma.user.create({
        data: {
            name: 'Muhammed Ali Yücesu',
            email: 'admin@cafeflow.com',
            passwordHash: 'test_hash_123',
            role: 'SUPER_ADMIN',
            businessId: business.id,
            branchId: branch.id,
        },
    });
    // 4. Örnek QR Masa
    await prisma.table.create({
        data: {
            branchId: branch.id,
            name: 'Masa 1',
            qrCode: 'qr-harput-masa-1',
        },
    });
    console.log('✅ Örnek işletme, şube, masa ve yönetici hesabı başarıyla oluşturuldu!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
