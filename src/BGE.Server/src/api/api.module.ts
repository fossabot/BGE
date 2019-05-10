import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { signalRConnectionFactory } from '../engine/engine.service';

@Module({
  controllers: [ApiController],
  providers: [signalRConnectionFactory],
})
export class ApiModule {}
