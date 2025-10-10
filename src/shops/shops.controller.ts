import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopCredentialsDto } from './dto/update-shop-credentials.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('shops')
@UseGuards(JwtAuthGuard)
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) { }

    @Post()
    create(@Body() createShopDto: CreateShopDto) {
        return this.shopsService.create(createShopDto);
    }

    @Get()
    findAll() {
        return this.shopsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shopsService.findOne(id);
    }

    @Patch(':id/credentials')
    updateCredentials(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateShopCredentialsDto: UpdateShopCredentialsDto,
    ) {
        return this.shopsService.updateCredentials(id, updateShopCredentialsDto);
    }
}