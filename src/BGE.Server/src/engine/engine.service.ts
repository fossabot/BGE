import * as signalR from '@aspnet/signalr';
import { Provider } from '@nestjs/common';

export const signalRConnectionFactory: Provider = {
  provide: 'SIGNALR_CONNECTION',
  useFactory: async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/engine')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const start = async () => {
      try {
        await connection.start();
      } catch (err) {
        setTimeout(() => start(), 5000);
      }
    };

    await start();
    connection.onclose(async () => {
      await start();
    });
    return connection;
  },
};
