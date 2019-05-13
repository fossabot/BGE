import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { signalRConnectionFactory } from './api.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ApiController],
  providers: [signalRConnectionFactory],
  imports: [AuthModule],
})
export class ApiModule {}
