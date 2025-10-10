import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopOwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contacts: string;
}