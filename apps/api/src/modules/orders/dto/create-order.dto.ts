import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderSource } from '@prisma/client'; 

// Siparişin içindeki her bir ürünün kuralı
class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string; // Örn: "Şekersiz olsun"
}

// Ana sipariş paketinin kuralı
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  branchId: string; 

  @IsString()
  @IsNotEmpty()
  tableId: string;

  @IsEnum(OrderSource)
  @IsNotEmpty()
  source: OrderSource; // Sadece "CASHIER" veya "QR_MENU" olabilir

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]; // İçinde birden fazla OrderItemDto barındıran dizi

  @IsString()
  @IsOptional()
  note?: string; // Genel masa notu
}