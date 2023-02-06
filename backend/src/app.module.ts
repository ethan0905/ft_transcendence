import { Module } from '@nestjs/common';
import { AuthModule } from "./auth/auth.module";
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
// A module is a class anotated with a @Module decorator. The module decorator provide
// metadata that Nest makes use of to organize the application structure

@Module({
  imports: [AuthModule, UserModule, BookmarkModule],
})

export class AppModule {}
