import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async createManager(dto: CreateManagerDto) {
    const existingAdmin = await this.prisma.admin.findUnique({ where: { email: dto.email } });
    if (existingAdmin) {
      throw new BadRequestException('Администратор с таким email уже существует.');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { password, ...result } = await this.prisma.admin.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: Role.MANAGER,
      },
    });
    return result;
  }

  async findAll() {
    const admins = await this.prisma.admin.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return admins;
  }

  async updatePassword(id: number, dto: UpdateAdminPasswordDto) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Администратор с ID ${id} не найден.`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.admin.update({
      where: { id },
      data: { password: hashedPassword, tokenVersion: { increment: 1 } },
    });
  }

  async remove(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Администратор с ID ${id} не найден.`);
    }
    if (admin.role === Role.ROOT) {
      throw new BadRequestException('невозможно удалить корневого пользователя.');
    }
    await this.prisma.admin.delete({ where: { id } });
  }
}