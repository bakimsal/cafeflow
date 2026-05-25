import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;
}