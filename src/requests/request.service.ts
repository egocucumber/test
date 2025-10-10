import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus, TerminalStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.request.findMany({
            include: { shop: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    private async findOne(id: number) {
        const request = await this.prisma.request.findUnique({ where: { id } });
        if (!request) {
            throw new NotFoundException(`Запрос с ID ${id} не найден.`);
        }
        return request;
    }

    async approve(id: number) {
        const request = await this.findOne(id);
        if (request.status !== RequestStatus.PENDING) {
            throw new BadRequestException('Запрос уже обработан.');
        }

        const existingTerminal = await this.prisma.terminal.findUnique({
            where: { macAddress: request.macAddress },
        });
        if (existingTerminal) {
            throw new BadRequestException(`Терминал с MAC адресом ${request.macAddress} уже существует.`);
        }

        return this.prisma.$transaction(async (tx) => {
            const newTerminal = await tx.terminal.create({
                data: {
                    macAddress: request.macAddress,
                    shopId: request.shopId,
                    status: TerminalStatus.INACTIVE,
                },
            });

            await tx.request.update({
                where: { id },
                data: { status: RequestStatus.APPROVED, comment: 'Терминал создан.' },
            });

            return newTerminal;
        });
    }

    async reject(id: number) {
        const request = await this.findOne(id);
        if (request.status !== RequestStatus.PENDING) {
            throw new BadRequestException('Запрос уже обработан.');
        }
        return this.prisma.request.update({
            where: { id },
            data: { status: RequestStatus.REJECTED },
        });
    }

    async addComment(id: number, comment: string) {
        await this.findOne(id);
        return this.prisma.request.update({
            where: { id },
            data: { comment },
        });
    }
}