import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { TerminalStatus } from '@prisma/client';

@Injectable()
export class TerminalsService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.terminal.findMany({ include: { shop: true } });
    }

    async findOne(id: number) {
        const terminal = await this.prisma.terminal.findUnique({
            where: { id },
            include: { shop: true },
        });
        if (!terminal) {
            throw new NotFoundException(`Терминал с ID ${id} не найден.`);
        }
        return terminal;
    }

    async updateStatus(id: number, dto: UpdateTerminalStatusDto) {
        await this.findOne(id);
        return this.prisma.terminal.update({
            where: { id },
            data: { status: dto.status },
        });
    }

    async handleHeartbeat(macAddress: string) {
        await this.prisma.terminal.updateMany({
            where: { macAddress },
            data: { status: TerminalStatus.ACTIVE, updatedAt: new Date() },
        });
    }
}