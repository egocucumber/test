import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Admin, Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.admin.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Неверные данные.');
        }

        const updatedUser = await this.prisma.admin.update({
            where: { id: user.id },
            data: { tokenVersion: { increment: 1 } },
        });

        return this.generateToken(updatedUser);
    }

    async logout(userId: number) {
        await this.prisma.admin.update({
            where: { id: userId },
            data: { tokenVersion: { increment: 1 } },
        });
        return { message: 'Успешный выход.' };
    }

    async refreshToken(user: any) {
  const dbUser = await this.prisma.admin.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    throw new UnauthorizedException('Пользователь не найден.');
  }

  return this.generateToken(dbUser); 
}

    private generateToken(user: Admin) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}