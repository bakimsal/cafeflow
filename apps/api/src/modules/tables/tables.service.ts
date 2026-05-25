import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTableDto } from './dto/create-table.dto'; // <-- 1. DTO'yu buraya çağırıyoruz

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Masa Ekleme (DTO ile güncelledik)
  async createTable(data: CreateTableDto) { // <-- 2. Artık 3 parça değil, tek DTO paketi alıyor
    return this.prisma.table.create({
      data: {
        name: data.name,
        qrCode: data.qrCode, 
        branch: { connect: { id: data.branchId } } 
      },
    });
  }

  // --------------------------------------------------------
  // AŞAĞIDAKİ TÜM KODLARIN EKSİKSİZ VE DOĞRU, AYNEN KALSIN!
  // --------------------------------------------------------

  // 2. Bir Şubedeki Tüm Masaları Getirme
  async getTablesByBranch(branchId: string) {
    return this.prisma.table.findMany({
      where: {
        branchId: branchId 
      }
    });
  }

  // 3. Tek Bir Masayı ID ile Getirme
  async getTableById(id: string) {
    return this.prisma.table.findUnique({
      where: { id: id }
    });
  }

  // 4. Masa Güncelleme
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