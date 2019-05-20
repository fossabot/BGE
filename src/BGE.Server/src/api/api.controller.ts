import {
  Body,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import { ShootRequest } from './dto/shoot-request.dto';
import { StartRequest } from './dto/start-request.dto';
import { StateRequest } from './dto/state-request.dto';
import { SIGNALR_CONNECTION } from '../constants';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
    private readonly apiService: ApiService,
  ) {}

  @HttpCode(200)
  @Post('/state')
  public async state(@Body() stateRequest: StateRequest) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    return await this.apiService.state(stateRequest.userId);
  }

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startRequest: StartRequest) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    return await this.apiService.start(startRequest);
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootRequest: ShootRequest) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    const result = await this.apiService.shoot(
      shootRequest.userId,
      shootRequest.x,
      shootRequest.y,
    );

    if (!!result) {
      return result;
    }
  }
}
