import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [ConfigModule],
})
export class DatabaseModule {}
