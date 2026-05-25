"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 1. Yeni Ürün Ekleme (Artık 4 parça yerine tek DTO paketi alıyor)
    async createProduct(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                category: { connect: { id: data.categoryId } },
                business: { connect: { id: data.businessId } }
            },
        });
    }
    // --------------------------------------------------------
    // AŞAĞIDAKİ TÜM KODLARIN EKSİKSİZ VE DOĞRU, AYNEN KALSIN!
    // --------------------------------------------------------
    // 2. Bir Kategoriye Ait Ürünleri Getirme
    async getProductsByCategory(categoryId) {
        return this.prisma.product.findMany({
            where: { categoryId: categoryId }
        });
    }
    // 3. Ürün Güncelleme (Fiyat, İsim, Stok veya Aktiflik durumu)
    async updateProduct(id, data) {
        return this.prisma.product.update({
            where: { id: id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.price !== undefined && { price: data.price }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.stock !== undefined && { stock: data.stock }),
                ...(data.description !== undefined && { description: data.description }),
            },
        });
    }
    // 4. Ürün Silme
    async deleteProduct(id) {
        return this.prisma.product.delete({
            where: { id: id },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
