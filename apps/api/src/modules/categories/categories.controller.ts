import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto'; // <-- DTO'yu ekledik

@Controller('api/categories') 
export class CategoriesController {
  
  constructor(private readonly categoriesService: CategoriesService) {}

  // 1. Yeni Kategori Ekleme
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    // DTO paketini doğrudan servise yolluyoruz
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // 2. Belirli Bir Kafenin Kategorilerini Getirme
  @Get('business/:businessId')
  async getBusinessCategories(@Param('businessId') businessId: string) {
    return this.categoriesService.getCategoriesByBusiness(businessId);
  }

  // 3. Kategori Güncelleme
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; isActive?: boolean }
  ) {
    return this.categoriesService.updateCategory(id, body.name, body.isActive);
  }

  // 4. Kategori Silme
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}