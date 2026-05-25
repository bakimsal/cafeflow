import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Örn: "Kahveler"

  @IsString()
  @IsNotEmpty()
  businessId: string; // Kategorinin bağlı olduğu işletme
}