import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SignalRGuard } from '../common/guards/signalr.guard';
import { ApiService } from './api.service';
import { ShootRequest } from './dto/shoot-request.dto';
import { StartRequest } from './dto/start-request.dto';
import { StateRequest } from './dto/state-request.dto';

@Controller('api')
@UseGuards(SignalRGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @HttpCode(200)
  @Post('/state')
  public async state(@Body() stateRequest: StateRequest) {
    return await this.apiService.state(stateRequest.userId);
  }

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startRequest: StartRequest) {
    return await this.apiService.start(startRequest);
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootRequest: ShootRequest) {
    return await this.apiService.shoot(
      shootRequest.userId,
      shootRequest.x,
      shootRequest.y,
    );
  }
}
