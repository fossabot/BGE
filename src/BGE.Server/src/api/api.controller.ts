import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import { ok, error } from '../util/response';
import { ShootDto } from './dto/shoot.dto';

@Controller('api')
export class ApiController {
  constructor(
    @Inject('SIGNALR_CONNECTION') private readonly connection: HubConnection,
  ) {}

  @HttpCode(200)
  @Post('/startGame')
  public async startGame() {
    if (this.connection.state === HubConnectionState.Disconnected) {
      return error('Connection is not established!');
    }

    return ok(await this.connection.invoke('StartGame'));
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootDto: ShootDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      return error('Connection is not established!');
    }

    return ok(await this.connection.invoke('Shoot', shootDto));
  }
}
