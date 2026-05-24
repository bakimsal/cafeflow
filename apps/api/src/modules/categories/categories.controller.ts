import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('api/categories') 
export class CategoriesController {
  
  constructor(private readonly categoriesService: CategoriesService) {}

  // 1. Yeni Kategori Ekleme İsteği
  @Post()
  async createCategory(@Body() body: { name: string; businessId: string }) {
    return this.categoriesService.createCategory(body.name, body.businessId);
  }

  // 2. Belirli Bir Kafenin Kategorilerini Getirme İsteği
  @Get('business/:businessId') // Çakışmayı önlemek için URL'yi biraz değiştirdim
  async getBusinessCategories(@Param('businessId') businessId: string) {
    return this.categoriesService.getCategoriesByBusiness(businessId);
  }

  // --- YENİ EKLENEN KISIMLAR ---

  // 3. Kategori Güncelleme İsteği (PATCH)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; isActive?: boolean }
  ) {
    return this.categoriesService.updateCategory(id, body.name, body.isActive);
  }

  // 4. Kategori Silme İsteği (DELETE)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}