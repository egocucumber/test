import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateShopDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsInt()
    @IsNotEmpty()
    ownerId: number;
}