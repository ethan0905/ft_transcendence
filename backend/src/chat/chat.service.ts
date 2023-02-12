import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditChatDto } from './dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async editChat(chatId: number, dto: EditChatDto) {
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