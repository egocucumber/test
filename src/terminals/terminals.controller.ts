import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TerminalHeartbeatDto } from './dto/terminal-heartbeat.dto';

@Controller('terminals')
export class TerminalsController {
    constructor(private readonly terminalsService: TerminalsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.terminalsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.terminalsService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTerminalStatusDto: UpdateTerminalStatusDto,
    ) {
        return this.terminalsService.updateStatus(id, updateTerminalStatusDto);
    }

    @Post('alive')
    @HttpCode(HttpStatus.NO_CONTENT)
    heartbeat(@Body() heartbeatDto: TerminalHeartbeatDto) {
        return this.terminalsService.handleHeartbeat(heartbeatDto.macAddress);
    }
}