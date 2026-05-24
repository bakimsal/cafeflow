import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Masa Ekleme
  async createTable(name: string, qrCode: string, branchId: string) {
    return this.prisma.table.create({
      data: {
        name: name,
        qrCode: qrCode, 
        branch: { connect: { id: branchId } } 
      },
    });
  }

  // 2. Bir Şubedeki Tüm Masaları Getirme
  async getTablesByBranch(branchId: string) {
    return this.prisma.table.findMany({
      where: {
        branchId: branchId 
      }
    });
  }

  // --- YENİ EKLENEN KISIMLAR ---

  // 3. Tek Bir Masayı ID ile Getirme (Detay ekranı için)
  async getTableById(id: string) {
    return this.prisma.table.findUnique({
      where: { id: id }
    });
  }

  // 4. Masa Güncelleme (İsim, QR Kod veya Durum değişirse)
  async updateTable(id: string, data: { name?: string; qrCode?: string; status?: any }) {
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
  async deleteTable(id: string) {
    return this.prisma.table.delete({
      where: { id: id },
    });
  }
}