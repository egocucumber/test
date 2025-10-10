import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateAdminPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}