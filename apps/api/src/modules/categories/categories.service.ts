import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto'; // <-- DTO'yu buraya çağırdık

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Kategori Ekleme (Artık DTO paketini kabul ediyor)
  async createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        business: { connect: { id: data.businessId } } 
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