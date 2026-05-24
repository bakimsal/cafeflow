import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Ürün Ekleme
  async createProduct(name: string, price: number, categoryId: string, businessId: string) {
    return this.prisma.product.create({
      data: {
        name: name,
        price: price,
        category: { connect: { id: categoryId } },
        business: { connect: { id: businessId } }
      },
    });
  }

  // 2. Bir Kategoriye Ait Ürünleri Getirme
  async getProductsByCategory(categoryId: string) {
    return this.prisma.product.findMany({
      where: { categoryId: categoryId }
    });
  }

  // --- YENİ EKLENEN KISIMLAR ---

  // 3. Ürün Güncelleme (Fiyat, İsim, Stok veya Aktiflik durumu)
  async updateProduct(id: string, data: { name?: string; price?: number; isActive?: boolean; stock?: number; description?: string }) {
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
  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}