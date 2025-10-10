import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.admin.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    const isPasswordMatching = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Неправильный пароль.');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('Новый пароль должен отличаться от предыдущего.');
    }
    
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.admin.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        tokenVersion: { increment: 1 }, 
      },
    });
  }
}