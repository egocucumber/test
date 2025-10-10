import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateManagerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}