import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopOwnerDto } from './dto/create-shop-owner.dto';
import { UpdateShopOwnerDto } from './dto/update-shop-owner.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopOwnersService {
    constructor(private readonly prisma: PrismaService) { }

    create(createShopOwnerDto: CreateShopOwnerDto) {
        return this.prisma.shopOwner.create({ data: createShopOwnerDto });
    }

    findAll() {
        return this.prisma.shopOwner.findMany();
    }

    async findOne(id: number) {
        const owner = await this.prisma.shopOwner.findUnique({
            where: { id },
            include: { shops: true },
        });
        if (!owner) {
            throw new NotFoundException(`Владелец с ID ${id} не найден.`);
        }
        return owner;
    }

    async update(id: number, updateShopOwnerDto: UpdateShopOwnerDto) {
        await this.findOne(id);
        return this.prisma.shopOwner.update({
            where: { id },
            data: updateShopOwnerDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.shopOwner.delete({ where: { id } });
    }
}