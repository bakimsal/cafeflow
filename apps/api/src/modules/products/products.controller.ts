import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() body: { name: string; price: number; categoryId: string; businessId: string }) {
    return this.productsService.createProduct(body.name, body.price, body.categoryId, body.businessId);
  }

  @Get('category/:categoryId') 
  async getCategoryProducts(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }

  // --- YENİ EKLENEN KISIMLAR ---

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number; isActive?: boolean; stock?: number; description?: string }
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}