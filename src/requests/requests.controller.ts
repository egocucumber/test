import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RequestsService } from './request.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    @Get()
    findAll() {
        return this.requestsService.findAll();
    }

    @Patch(':id/approve')
    approve(@Param('id', ParseIntPipe) id: number) {
        return this.requestsService.approve(id);
    }

    @Patch(':id/reject')
    reject(@Param('id', ParseIntPipe) id: number) {
        return this.requestsService.reject(id);
    }

    @Post(':id/comment')
    addComment(@Param('id', ParseIntPipe) id: number, @Body() addCommentDto: AddCommentDto) {
        return this.requestsService.addComment(id, addCommentDto.comment);
    }
}