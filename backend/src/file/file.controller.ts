import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Get, Param, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { UploadedFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Multer } from 'multer'; // npm i --save-dev @types/multer if error 
// import sharp from 'sharp';
import * as sharp from 'sharp';

@Controller('files')
export class FileController {
  constructor(private readonly prisma: PrismaService) {}

  @Post(':username/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('username') username: string, @UploadedFile() file: Multer.File) {
    console.log("username ---> ", username);

    // Get user by username
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const searchFileTest = await this.prisma.file.findFirst({
      where: {
        owner: {
          some: {
            id: user.id,
          },
        },
      },
    });
    
    if (searchFileTest) {
      await this.prisma.file.delete({
        where: {
          id: searchFileTest.id,
        },
      });
      console.log("File already existed for this user, so we deleted it!");
    }

    // if (previousFile) {
    //   await this.prisma.file.delete({
    //     where: {
    //       id: previousFile.id,
    //     },
    //   });
    // }


    // // Delete previous file if it exists inside the user
    // const previousFile = await this.prisma.file.findFirst({
    //   where: {
    //     owner: {
    //       id: user.id
    //     },
    //   },
    // });

    // if (previousFile) {
    //   await this.prisma.file.delete({
    //     where: {
    //       id: previousFile.id,
    //     },
    //   });
    // }
      

    // // Delete previous file if it exists inside the user
    // const previousFile = await this.prisma.file.findFirst({
    //   where: {
    //     owner: user.id,
    //   },
    // });
    // if (previousFile) {
    //   await this.prisma.file.delete({
    //     where: {
    //       id: previousFile.id,
    //     },
    //   });
    // }

    const newFile = await this.prisma.file.create({
      data: {
        content: file.buffer,
        filename: file.originalname,
        mimetype: file.mimetype,
        owner: {
          connect: {
            id: user.id,
          }
        },
      },
    });
  
    console.log("New file has been uploaded!");

    return newFile;

	// // Delete previous file if it exists
	// const previousFile = await this.prisma.file.findFirst();
	// if (previousFile) {
	//   await this.prisma.file.delete({
	// 	where: {
	// 	  id: previousFile.id,
	// 	},
	//   });
	// }
	
    // const newFile = await this.prisma.file.create({
    //   data: {
    //     content: file.buffer,
    //     filename: file.originalname,
    //     mimetype: file.mimetype,
    //   },
    // });

    // return newFile;
  }

// @Post('upload')
// @UseInterceptors(FileInterceptor('file'))
// async uploadFile(@UploadedFile() file: Multer.File, @Req() req: Request, @Res() res: Response) {
// 	// Get user by token
// 	console.log("req.headers.authorization ---> ", req.body.token);
// 	  const user = await this.prisma.user.findUnique({
// 		where: {
// 			accessToken: req.body.token,
// 		},
// 	  });
// 	  if (!user) {
// 		return res.status(401).send('Unauthorized');
// 	  }

//   // Delete previous file if it exists
//   const previousFile = await this.prisma.file.findFirst({
// 	where: {
// 	  userId: user.id,
// 	},
//   });
//   if (previousFile) {
// 	await this.prisma.file.delete({
// 	  where: {
// 		id: previousFile.id,
// 	  },
// 	});
//   }

//   const newFile = await this.prisma.file.create({
// 	data: {
// 	  content: file.buffer,
// 	  filename: file.originalname,
// 	  mimetype: file.mimetype,
// 	  user: {
// 		connect: {
// 		  id: user.id,
// 		},
// 	  },
// 	},
//   });
//   return newFile;
// }

@Get(':username')
async serveFile(@Param('username') username: string, @Res() res: Response) {

  // Get user by username
  const user = await this.prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const searchFileTest = await this.prisma.file.findFirst({
    where: {
      owner: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!searchFileTest) {
    res.status(404).send('File not found');
    return;
  }

  // Resize image to 200x200
  const imageBuffer = await sharp(searchFileTest.content)
  .resize(200, 200, { fit: 'cover' })
  .toBuffer();

  res.setHeader('Content-Type', searchFileTest.mimetype);
  res.send(imageBuffer);
  }
}

// the previous code is working, but I want to switch to :username 
//   @Get(':id')
//   async serveFile(@Param('id') id: string, @Res() res: Response) {

// 	const fileId = parseInt(id, 10);

//     const file = await this.prisma.file.findUnique({
//       	where: {
// 			id: fileId,
// 		},
//     });
//     if (!file) {
//       res.status(404).send('File not found');
//       return;
//     }
//     res.setHeader('Content-Type', file.mimetype);
//     res.send(file.content);
//   }
// }

// @Post(':username/upload')
// @UseInterceptors(FileInterceptor('file'))
// async uploadFile(@Param('username') username: string, @UploadedFile() file: Multer.File) {
//   console.log("username ---> ", username);

//   // Get user by username
//   const user = await this.prisma.user.findUnique({
//     where: {
//       username,
//     },
//   });

//   if (!user) {
//     throw new Error('User not found');
//   }

// // Delete previous file if it exists
// const previousFile = await this.prisma.file.findFirst();
// if (previousFile) {
//   await this.prisma.file.delete({
// 	where: {
// 	  id: previousFile.id,
// 	},
//   });
// }

//   const newFile = await this.prisma.file.create({
//     data: {
//       content: file.buffer,
//       filename: file.originalname,
//       mimetype: file.mimetype,
//     },
//   });

//   return newFile;
// }