import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatDto } from './dto/create-chat.dto';
import { updateChat } from './type/chat.type';
import { UserService } from 'src/user/user.service'

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        // private readonly userService: UserService,
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

          async get__channelsUserIn(id: number) {
            try {
              const source = await this.prisma.user.findUnique({
                where: {
                  id: id,
                },
                select: {
                  owner: {
                    where: {
                      dm: true,
                    },
                  },
                  admin: true,
                  //member: true,
                  //invited: true,
                },
              });
              const channels = this.organize__channelToJoin(source);
              return channels;
            } catch (error) {
              console.log('get__channels error:', error);
            }
          }

          organize__channelToJoin(source: any) {
            const channels = [];
            if (source) {
              if (source.owner)
                for (let index = 0; index < source.owner.length; index++) {
                  const channel = source.owner[index].name;
                  channels.push(channel);
                }
              if (source.admin)
                for (let index = 0; index < source.admin.length; index++) {
                  const channel = source.admin[index].name;
                  channels.push(channel);
                }
              if (source.member)
                for (let index = 0; index < source.member.length; index++) {
                  const channel = source.member[index].name;
                  channels.push(channel);
                }
              if (source.invited)
                for (let index = 0; index < source.invited.length; index++) {
                  const channel = source.invited[index].name;
                  channels.push(channel);
                }
            }
            return channels;
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