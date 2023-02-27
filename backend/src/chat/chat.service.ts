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
        
        // async updateChat(info: updateChat) {
        //     const idchat = info.channelId;
        //     const channel = await this.prisma.chat.update(
        //       {
        //         where: {
        //           id: idchat,
        //         }
        //         data: {
        //           Password : info.Password || info.newPassword,
        //           isPassword : info.isPassword || null,
        //           isPrivate : info.Private,
        //         }
        //       }
        //     )
        // }

}