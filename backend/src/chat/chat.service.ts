import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/create-chat.dto';
import { updateChat } from './type/chat.type';
import { UserService } from 'src/user/user.service'

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly serService: UserService,
        ) {}

        async newChannel(info: ChatDto) {
            const password = info.Password;
            const channel = await this.prisma.chat.create({
              data: {
                chatName: info.chatName,
                Password: password,
              }
            });
            return channel;
          }

}