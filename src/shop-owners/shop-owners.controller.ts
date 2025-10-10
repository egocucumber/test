import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ShopOwnersService } from './shop-owners.service';
import { CreateShopOwnerDto } from './dto/create-shop-owner.dto';
import { UpdateShopOwnerDto } from './dto/update-shop-owner.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('shops-owners')
@UseGuards(JwtAuthGuard)
export class ShopOwnersController {
    constructor(private readonly shopOwnersService: ShopOwnersService) { }

    @Post()
    create(@Body() createShopOwnerDto: CreateShopOwnerDto) {
        return this.shopOwnersService.create(createShopOwnerDto);
    }

    @Get()
    findAll() {
        return this.shopOwnersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shopOwnersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateShopOwnerDto: UpdateShopOwnerDto) {
        return this.shopOwnersService.update(id, updateShopOwnerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.shopOwnersService.remove(id);
    }
}