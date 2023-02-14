import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //block any other type variables
  })); // in order to use NestJs builtin pipes

  var cors = require('cors'); //for connectivity with frontend
  app.use(cors());

  await app.listen(3333);
}
bootstrap();
