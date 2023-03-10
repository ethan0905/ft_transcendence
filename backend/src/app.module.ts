import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

// A module is a class anotated with a @Module decorator. The module decorator provide
// metadata that Nest makes use of to organize the application structure
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // does the same thing as @Global export decorator, allow us to access to nestJs ConfigModule inside other modules
    }),
    AuthModule,
    UserModule,
    PrismaModule],
})
 
export class AppModule {}
