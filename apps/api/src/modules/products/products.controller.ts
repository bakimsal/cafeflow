import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto'; // <-- DTO eklendi

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    // DTO paketini doğrudan servise yolluyoruz
    return this.productsService.createProduct(createProductDto);
  }

  @Get('category/:categoryId') 
  async getCategoryProducts(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }

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