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

        async newChannel(info: ChannelCreateDto, username: string) {
            const password = info.Password ?? null;
            if (info.isPrivate === undefined)
              info.isPrivate = false;
            if (info.isPassword === undefined)
              info.isPassword = false;
            const user = await this.userService.getUser(username);
            const channel = await this.prisma.channel.create({
              data: {
                channelName: info.chatName,
                password: password,
                isPrivate: info.isPrivate,
                isPassword: info.isPassword,
                owner: {
                  connect: {
                    username : username,
                  }
                },
                admins: {
                  connect: {
                    username : username,
                  }
                },
                members: {
                  connect: {
                    username : username,
                  }
                }
              }
            });
            return channel;
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

        async quit_Chan(username: string, id : number)
        {
          const value = await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
          console.log(value);
        }

        async invit_Chan(username: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                invited : {
                  connect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        async ban_Chan(username: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    username : username,
                  },
                },
                banned : {
                  connect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }


        async kick_Chan(username: string, id : number)
        {
          const chan = await this.prisma.channel.findUnique({
            where : {
              id : id,
            },
            select : {
              admins : true,
            }
          })
          const isadmin = chan.admins.find(admins => admins.username == username)
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                members : {
                  disconnect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
          if (isadmin)
            await this.prisma.channel.update(
              {
                where: {
                  id: id,
                },
                data : {
                  admins : {
                    disconnect : {
                      username : username,
                    },
                  },
                },
                  //isPrivate : info.Private,
                }
            )

        }

        
        async mute_Chan(username: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                muted : {
                  connect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        
        
        async unmute_Chan(username: string, id : number)
        {
          await this.prisma.channel.update(
            {
              where: {
                id: id,
              },
              data : {
                muted : {
                  disconnect : {
                    username : username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
        }

        async join_Chan(data: JoinChanDto, user: User)
        {
          const isInChan = await this.userIsInChan(user.accessToken, data.chatId);
          if (isInChan)
            return (0);
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
          if (chan === null)
            return (4);
          const isban = chan.banned.find(banned => banned.username == user.username)
          const isinvit = chan.invited.find(invited => invited.username == user.username)
          const isPriv = chan.isPrivate;
          if (isPriv || isban)
          {
            if (isPriv && !isinvit)
            return (1);
            else if (isban)
            return (2);
          }
          else if (chan.password !== ''){
            if (data.Password === undefined || data.Password != chan.password)
              return (3);
          }
          await this.prisma.channel.update(
            {
              where: {
                id: data.chatId,
              },
              data : {
                members : {
                  connect : {
                    username : user.username,
                  },
                },
              },
                //isPrivate : info.Private,
              }
          )
          if (isinvit)
            await this.prisma.channel.update(
              {
                where: {
                  id: data.chatId,
                },
                data : {
                  invited : {
                    disconnect : {
                      username : user.username,
                    },
                  },
                },
                  //isPrivate : info.Private,
                }
            )
          return (0);
        }

        async isBan_Chan(username: string, id : number)
        {
          const chan = await this.prisma.channel.findFirst({
            where: {
                      id: id,
              
          },
            select : {
              banned : true,
            }
          })
          const isban : User = chan.banned.find(banned => banned.username == username)
          if (isban)
            return (true)
          else
            return (false)
        }

        async isAdmin_Chan(username: string, id : number)
        {
          const chan = await this.prisma.channel.findFirst({
            where: {
                      id: id,
              
          },
            select : {
              admins : true,
            }
          })
          const isad : User = chan.admins.find(admins => admins.username == username)
          if (isad)
            return (true)
          else
            return (false)
        }

        async newMsg(info : ChannelMessageSendDto, id : number)
        {
          const channelid = info.chatId;
          const user = await this.prisma.user.findUnique({
            where: {
              id: id,
            },
          });
          const isInChan = await this.userIsInChan(user.accessToken, channelid);
          const isMuted = await this.userIsChanMuted(user.accessToken, channelid);
          if (!isInChan || isMuted){
            return (null);
          }
          const message: Message = await this.prisma.message.create({
            data: {
              owner :{
                connect: {
                  id : user.id,
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

        async get__channelsUserCanJoin(token:string) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                OR: [
                {
                    isPrivate: false
                },
                {invited : { some : { accessToken : token}}},
              ],
              NOT : {
                members : { some : { accessToken : token}},
              }
              },
              select: {
                id : true,
                channelName: true,
              },
            });
            return source;
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async get__channelsUserIn(token:string) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                members : { some : {accessToken : token}},
              },
              select: {
                id : true,
                channelName: true,
              },
            });
            return source;
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async get__allUserInchan(id : number) {
          try {
            const source = await this.prisma.channel.findUnique({
              where: {
                id : id,
                },
              select: {
                members : true,
              },
            });
            return source.members;
          } catch (error) {
            console.log('get__user error:', error);
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
                members: {
                  select:{
                    username:true,
                    status:true,
                    avatarUrl:true,
                  }
                }
              },
            });
            return source
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async get__chanNamebyId(id : number) {
          try {
            const source = await this.prisma.channel.findUnique({
              where: {
                id : id,
              },
              select: {
                channelName: true,
              },
            });
            return source
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async getChannelProtection(id : number) {
          try {
            const source = await this.prisma.channel.findUnique({
              where: {
                id : id,
              },
              select: {
                password: true,
                members:true,
              },
            });
            return source
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async get__MsgIn(id : number) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                id : id,
              },
              select: {
                messages: true,
              },
            });
            return source
          } catch (error) {
            console.log('get__channels error:', error);
          }
        }

        async get__UserBanIn(id : number) {
          try {
            const source = await this.prisma.channel.findMany({
              where: {
                id : id,
              },
              select: {
                banned: true,
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
            if (await this.isAdmin_Chan(info.username, info.channelid) == true)
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

          async userIsInChan(token:string, id_channel:number):Promise<boolean>{
            const channels = await this.prisma.user.findUnique({
              where:{
                accessToken:token
              },
              select:{
                members:true
              }
            })
            for (let i = 0; i < channels.members.length; i++){
              if (channels.members[i].id === id_channel)
                return true;
            }
            return false;
          }

          async userIsChanMuted(token:string, id_channel:number):Promise<boolean>{
            const channels = await this.prisma.user.findUnique({
              where:{
                accessToken:token
              },
              select:{
                muted:true
              }
            })
            for (let i = 0; i < channels.muted.length; i++){
              if (channels.muted[i].id === id_channel)
                return true;
            }
            return false;
          }

          async getUsername(token:string){
            return this.prisma.user.findUnique({
              where: {
                accessToken: token,
              },
              select: {
                username: true,
              },
            });
          }
  }