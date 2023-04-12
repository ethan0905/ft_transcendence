import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelCreateDto } from './dto/create-chat.dto';
import { ChannelMessageSendDto, DmMsgSend  } from './dto/msg.dto';
import { updateChat } from './type/chat.type';
import { UserService } from 'src/user/user.service'
import { Message, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JoinChanDto, EditChannelCreateDto } from 'src/chat/dto/edit-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly auth: AuthService,
        ) {}

        async newChannel(info: ChannelCreateDto) {
            const password = info.Password ?? null;
            if (info.isPrivate === undefined)
              info.isPrivate = false;
            if (info.isPassword === undefined)
              info.isPassword = false;
            console.log(info.isPrivate)
            const user = await this.userService.getUser(info.email);
            const channel = await this.prisma.channel.create({
              data: {
                channelName: info.chatName,
                password: password,
                isPrivate: info.isPrivate,
                isPassword: info.isPassword,
                owner: {
                  connect: {
                    email : info.email,
                  }
                },
                admins: {
                  connect: {
                    email : info.email,
                  }
                },
                members: {
                  connect: {
                    email : info.email,
                  }
                }
            }
          });
        }

        async delChanById(id : number)
        {
          const chan = await this.prisma.channel.delete(
            {
              where: {
                id : id,
              },
            }
          )
        }

        async quit_Chan(Token: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    accessToken : Token,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        async invit_Chan(Token: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                invited : {
                  connect : {
                    accessToken : Token,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        async ban_Chan(Token: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    accessToken : Token,
                  },
                },
                banned : {
                  connect : {
                    accessToken : Token,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }


        async kick_Chan(Token: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    accessToken : Token,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        async join_Chan(data: JoinChanDto)
        {
          const chan = await this.prisma.channel.findUnique({
            where : {
              id : data.chatId,
            },
            select : {
              isPrivate : true,
              isPassword : true,
              banned : true,
              password : true,
              invited : true,
            }
          })
          const isPriv = chan.isPrivate.valueOf()
          const isPass = chan.isPassword.valueOf()
          const isban = chan.banned.find(banned => banned.accessToken == data.Token)
          const isinvit = chan.invited.find(invited => invited.accessToken == data.Token)
          if (isPriv || isban)
          {
            if (isPriv && !isinvit)
              return (1);
            else if (isban)
              return (2);
          }
          else if (isPass)
            if (data.Password != chan.password)
              return (3);
          await this.prisma.channel.update(
            {
              where: {
                id: data.chatId,
              },
              data : {
                members : {
                  connect : {
                    accessToken : data.Token,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
          return (0);
        }

        async isBan_Chan(Token: string, id : number)
        {
          const chan = await this.prisma.channel.findFirst({
            where: {
                      id: id,
              
          },
            select : {
              banned : true,
            }
          })
          const isban : User = chan.banned.find(banned => banned.accessToken == Token)
          if (isban)
            return (true)
          else
            return (false)
        }

        async isAdmin_Chan(Token: string, id : number)
        {
          const chan = await this.prisma.channel.findFirst({
            where: {
                      id: id,
              
          },
            select : {
              admins : true,
            }
          })
          const isad : User = chan.admins.find(admins => admins.accessToken == Token)
          if (isad)
            return (true)
          else
            return (false)
        }

        async newMsg(info : ChannelMessageSendDto, id : number)
        {
          const channelid = info.chatId;
          const user = this.prisma.user.findUnique({
            where: {
             id: id,
            },
          });
          const userid = (await user).id;
          const channel = this.prisma.channel.findUnique({
            where: {
             id: channelid,
            },
          });
          const message: Message = await this.prisma.message.create({
            data: {
              owner :{
                connect: {
                  id : userid,
                }
              },
              channel : {
                connect: {
                  id : info.chatId,
                }
              },
              message : info.msg,
            },
            select: {
              id: true,
              createdAt: true,
              message: true,
              userId: true,
              channelId: true,
            },
          });

          return (message);
        }

        async newDM(info : DmMsgSend, id : number)
        {
          const channelid = parseInt(info.target);
          const user = this.prisma.user.findUnique({
            where: {
             id: id,
            },
          });
          const userid = (await user).id;
          const channel = this.prisma.channel.findUnique({
            where: {
             id: channelid,
            },
          });
          const message: Message = await this.prisma.message.create({
            data: {
              owner :{
                connect: {
                  id : userid,
                }
              },
              channel : {
                connect: {
                  id : channelid,
                }
              },
              message : info.msg,
            },
            select: {
              id: true,
              createdAt: true,
              message: true,
              userId: true,
              channelId: true,
            },
          });

          return (message);
        }

        async get__channelsUserIn(Token: string) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                members : {
                  every: {
                    accessToken : Token,
                  },
                },
              },
              select: {
                id: true,
                channelName: true,
              },
            });
            return source;
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        organize__channelToJoin(source: any) {
          const channels = [];
          console.log("source : ", source)
          console.log("channelName : ", source.channelName)
          console.log("source size : ", source.contains)
          console.log("member : ", source.member)

          return channels;
        }

        async get__UserIn(id : number) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                id : id,
              },
              select: {
                id: true,
                members: true,
              },
            });
            return source;
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }
        
        async update_chan(info: EditChannelCreateDto) {

            const idchat = info.channelid;
            if (info.isPrivate == undefined)
              info.isPrivate = false;
            const isPass = info.isPassword.valueOf();
            if (await this.isAdmin_Chan(info.Token, info.channelid) == true)
            {
              if (isPass)
                if (!info.Password)
                  return (1);
              await this.prisma.channel.update(
                {
                  where: {
                    id: idchat,
                  },
                  data: {
                    password : info.Password,
                    isPassword : info.isPassword || null,
                    isPrivate : info.isPrivate,
                    //isPrivate : info.Private,
                  }
                }
              )
              if (info.newname)
              {  
                await this.prisma.channel.update(
                  {
                    where: {
                      id: idchat,
                    },
                    data: {
                      channelName : info.newname,
                    },
                  }
                )
              }
              return (0);
            }
            else
              return (2);
          }

  }