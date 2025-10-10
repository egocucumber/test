import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateShopCredentialsDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}