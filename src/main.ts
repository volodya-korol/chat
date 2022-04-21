import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { RedocModule } from 'nestjs-redoc';
import { AppModule } from './app/app.module';
import { redocOptions } from './config/docs/redocOptions';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // * validation
  app.useGlobalPipes(new ValidationPipe());
  // * cookie
  app.use(cookieParser());
  // * cors
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  // * docs
  const config = new DocumentBuilder()
    .setTitle('Chat API docs')
    .setContact('Email', '', 'volodyakorol48@gmail.com')
    .addCookieAuth('session-id')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await RedocModule.setup('/docs', app, document, redocOptions);
  // * -----------
  await app.listen(configService.get('PORT'));
  console.log(`server started on`);
}
bootstrap();
