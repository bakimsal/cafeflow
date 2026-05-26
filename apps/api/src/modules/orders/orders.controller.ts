import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get('open/table/:tableId')
  async getOpenOrderByTable(@Param('tableId') tableId: string) {
    return this.ordersService.getOpenOrderByTable(tableId);
  }

  @Post(':id/items')
  async addItemsToOrder(
    @Param('id') orderId: string,
    @Body() addOrderItemDto: AddOrderItemDto,
  ) {
    return this.ordersService.addItemsToOrder(orderId, addOrderItemDto);
  }

  // İŞTE EKSİK OLAN KAPI BURASIYDI!
  @Patch(':id/complete')
  async completeOrder(@Param('id') orderId: string) {
    return this.ordersService.completeOrder(orderId);
  }
}