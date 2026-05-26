import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SingleItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class AddOrderItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleItemDto)
  items: SingleItemDto[];
}