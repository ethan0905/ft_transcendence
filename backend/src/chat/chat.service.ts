import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async editChat(chatId: number, dto: ChatDto) {
        const chat = await this.prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                ...dto,
            },
        });

        return chat;
    }
}