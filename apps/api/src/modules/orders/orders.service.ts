import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service'; 
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 1. Yeni Sipariş Oluşturma
  async createOrder(data: CreateOrderDto) {
    const productIds = data.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let orderTotalAmount = 0;

    const orderItemsData = data.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new NotFoundException(`Ürün bulunamadı: ${item.productId}`);

      const itemTotalPrice = product.price * item.quantity;
      orderTotalAmount += itemTotalPrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotalPrice,
        note: item.note,
      };
    });

    return this.prisma.order.create({
      data: {
        branchId: data.branchId,
        tableId: data.tableId,
        source: data.source,
        note: data.note,
        totalAmount: orderTotalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  // 2. Masadaki Açık Adisyonu Getirme
  async getOpenOrderByTable(tableId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        tableId: tableId,
        status: 'OPEN', 
      },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Bu masada açık bir adisyon bulunamadı.');
    }

    return order;
  }

  // 3. Açık Adisyona Yeni Ürün(ler) Ekleme
  async addItemsToOrder(orderId: string, data: AddOrderItemDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) throw new NotFoundException('Sipariş bulunamadı.');
    if (order.status !== 'OPEN') throw new Error('Sadece açık adisyonlara ürün eklenebilir.');

    const productIds = data.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let additionalAmount = 0;

    const newItemsData = data.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new NotFoundException(`Ürün bulunamadı: ${item.productId}`);

      const itemTotalPrice = product.price * item.quantity;
      additionalAmount += itemTotalPrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotalPrice,
        note: item.note,
      };
    });

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: { increment: additionalAmount }, 
        items: {
          create: newItemsData, 
        },
      },
      include: {
        items: {
          include: { product: true } 
        },
      },
    });
  }

  // 4. Adisyonu Kapatma VE Masayı Boşaltma (YENİ EKLENEN KISIM)
  async completeOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) throw new NotFoundException('Sipariş bulunamadı.');
    if (order.status === 'PAID') throw new Error('Bu adisyon zaten kapatılmış!');

    // 1. Adisyonu PAID yapıyoruz
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });

    // 2. Masanın statüsünü EMPTY yapıp temizliyoruz
    await this.prisma.table.update({
      where: { id: order.tableId },
      data: { status: 'EMPTY' },
    });

    return updatedOrder;
  }
}