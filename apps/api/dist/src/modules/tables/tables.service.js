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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let TablesService = class TablesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 1. Yeni Masa Ekleme
    async createTable(name, qrCode, branchId) {
        return this.prisma.table.create({
            data: {
                name: name,
                qrCode: qrCode,
                branch: { connect: { id: branchId } }
            },
        });
    }
    // 2. Bir Şubedeki Tüm Masaları Getirme
    async getTablesByBranch(branchId) {
        return this.prisma.table.findMany({
            where: {
                branchId: branchId
            }
        });
    }
    // --- YENİ EKLENEN KISIMLAR ---
    // 3. Tek Bir Masayı ID ile Getirme (Detay ekranı için)
    async getTableById(id) {
        return this.prisma.table.findUnique({
            where: { id: id }
        });
    }
    // 4. Masa Güncelleme (İsim, QR Kod veya Durum değişirse)
    async updateTable(id, data) {
        return this.prisma.table.update({
            where: { id: id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.qrCode !== undefined && { qrCode: data.qrCode }),
                ...(data.status !== undefined && { status: data.status }),
            },
        });
    }
    // 5. Masa Silme
    async deleteTable(id) {
        return this.prisma.table.delete({
            where: { id: id },
        });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
