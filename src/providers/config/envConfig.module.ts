import * as joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joi.object({
        // global
        PORT: joi.number().required(),
      }),
      isGlobal: true,
    }),
  ],
})
export class EnvConfigModule {}
