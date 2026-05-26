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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 1. Yeni Sipariş Oluşturma
    async createOrder(data) {
        const productIds = data.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        let orderTotalAmount = 0;
        const orderItemsData = data.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product)
                throw new common_1.NotFoundException(`Ürün bulunamadı: ${item.productId}`);
            const itemTotalPrice = product.price * item.quantity;
            orderTotalAmount += itemTotalPrice;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotalPrice,
                note: item.note,
            };
        });
        return this.prisma.order.create({
            data: {
                branchId: data.branchId,
                tableId: data.tableId,
                source: data.source,
                note: data.note,
                totalAmount: orderTotalAmount,
                items: {
                    create: orderItemsData,
                },
            },
            include: {
                items: true,
            },
        });
    }
    // 2. Masadaki Açık Adisyonu Getirme
    async getOpenOrderByTable(tableId) {
        const order = await this.prisma.order.findFirst({
            where: {
                tableId: tableId,
                status: 'OPEN',
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Bu masada açık bir adisyon bulunamadı.');
        }
        return order;
    }
    // 3. Açık Adisyona Yeni Ürün(ler) Ekleme
    async addItemsToOrder(orderId, data) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Sipariş bulunamadı.');
        if (order.status !== 'OPEN')
            throw new Error('Sadece açık adisyonlara ürün eklenebilir.');
        const productIds = data.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        let additionalAmount = 0;
        const newItemsData = data.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product)
                throw new common_1.NotFoundException(`Ürün bulunamadı: ${item.productId}`);
            const itemTotalPrice = product.price * item.quantity;
            additionalAmount += itemTotalPrice;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotalPrice,
                note: item.note,
            };
        });
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                totalAmount: { increment: additionalAmount },
                items: {
                    create: newItemsData,
                },
            },
            include: {
                items: {
                    include: { product: true }
                },
            },
        });
    }
    // 4. Adisyonu Kapatma VE Masayı Boşaltma (YENİ EKLENEN KISIM)
    async completeOrder(orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Sipariş bulunamadı.');
        if (order.status === 'PAID')
            throw new Error('Bu adisyon zaten kapatılmış!');
        // 1. Adisyonu PAID yapıyoruz
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
        });
        // 2. Masanın statüsünü EMPTY yapıp temizliyoruz
        await this.prisma.table.update({
            where: { id: order.tableId },
            data: { status: 'EMPTY' },
        });
        return updatedOrder;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
