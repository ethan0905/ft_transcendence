import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditChatDto } from './dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}


    getChats(Name: String) {
        return this.prisma.chat.findMany({
            where: {
                chatName: Name,
            },
        });
    }

    getChatsById(chatId: number, chatName: String) {
        return this.prisma.chat.findFirst({
            where: {
                id: chatId,
                chatName: chatName,
            },
        });
    }

    createChats(chatName: String, dto: CreateChatDto) {
        const chat = this.prisma.chat.create({
            data: {
                chatName,
                ...dto,
            },
        });

        return chat;
    }

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

    async deleteChat(Name: String) {
        const chat = await this.prisma.chat.delete({
            where: {
                chatName: Name,
            },
        });

        return chat;
    }
}