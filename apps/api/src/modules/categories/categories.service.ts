import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Kategori Ekleme
  async createCategory(name: string, businessId: string) {
    return this.prisma.category.create({
      data: {
        name: name,
        business: { connect: { id: businessId } } 
      },
    });
  }

  // 2. Belirli Bir Kafenin Tüm Kategorilerini Getirme
  async getCategoriesByBusiness(businessId: string) {
    return this.prisma.category.findMany({
      where: {
        businessId: businessId 
      }
    });
  }

  // --- YENİ EKLENEN KISIM ---

  // 3. Kategori Güncelleme (PATCH)
  async updateCategory(id: string, name?: string, isActive?: boolean) {
    return this.prisma.category.update({
      where: { id: id },
      data: {
        ...(name !== undefined && { name }),
        ...(isActive !== undefined && { isActive }),
      },
    });
  }

  // 4. Kategori Silme (DELETE)
  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: { id: id },
    });
  }
}