import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { apiProviders } from './api.providers';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { ApiService } from './api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService, ...apiProviders],
  imports: [ConfigModule, AuthModule, DatabaseModule],
})
export class ApiModule {}
