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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AuthService = class AuthService {
    // Veritabanı bağlantımızı içeri alıyoruz
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(email, pass) {
        // 1. Kullanıcıyı bul
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        // 2. Kullanıcı yoksa veya şifre yanlışsa hata fırlat
        if (!user || user.passwordHash !== pass) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı dostum!');
        }
        // 3. Giriş başarılıysa bilgileri döndür
        return {
            message: 'Giriş başarılı!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
