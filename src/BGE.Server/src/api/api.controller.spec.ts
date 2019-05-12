import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { signalRConnectionFactory } from './api.service';

describe('Api Controller', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [signalRConnectionFactory],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should work', async () => {
    const response = await controller.start({ cols: 6, rows: 6 });
    const { token, playerState } = response;
    console.log('Host:');
    console.log(playerState.field);
    const response2 = await controller.start({ token });
    console.log('Player:');
    console.log(response2.playerState.field);

    const shootResponse = await controller.shoot({ token, x: 0, y: 0 });
    console.log(shootResponse);
    //console.log(shootResponse.playerState.field);
  });
});
