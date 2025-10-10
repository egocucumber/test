import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ROOT)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.adminsService.createManager(createManagerDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminPasswordDto: UpdateAdminPasswordDto,
  ) {
    return this.adminsService.updatePassword(id, updateAdminPasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.remove(id);
  }
}
