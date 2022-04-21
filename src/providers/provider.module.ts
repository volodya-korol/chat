import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/envConfig.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EnvConfigModule, PrismaModule],
})
export class ProviderModule {}
