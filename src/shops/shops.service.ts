import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopCredentialsDto } from './dto/update-shop-credentials.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ShopsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createShopDto: CreateShopDto) {
        const owner = await this.prisma.shopOwner.findUnique({
            where: { id: createShopDto.ownerId },
        });
        if (!owner) {
            throw new BadRequestException(`Владелец с ID ${createShopDto.ownerId} не существует.`);
        }

        const existingShop = await this.prisma.shop.findUnique({
            where: { login: createShopDto.login },
        });
        if (existingShop) {
            throw new BadRequestException(`Магазин с логином ${createShopDto.login} уже существует.`);
        }

        const hashedPassword = await bcrypt.hash(createShopDto.password, 10);

        return this.prisma.shop.create({
            data: {
                ...createShopDto,
                password: hashedPassword,
            },
        });
    }

    findAll() {
        return this.prisma.shop.findMany({ include: { owner: true } });
    }

    async findOne(id: number) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            include: { owner: true, terminals: true, requests: true },
        });
        if (!shop) {
            throw new NotFoundException(`Магазин с ID ${id} не найден.`);
        }
        return shop;
    }

    async updateCredentials(id: number, dto: UpdateShopCredentialsDto) {
        await this.findOne(id);

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.shop.update({
            where: { id },
            data: {
                login: dto.login,
                password: hashedPassword,
            },
        });
    }
}