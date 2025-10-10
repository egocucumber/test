import { IsOptional, IsString } from 'class-validator';

export class UpdateShopOwnerDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    contacts?: string;
}