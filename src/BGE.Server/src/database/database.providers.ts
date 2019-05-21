import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from '../common/constants';
import { ConfigService } from '../config/config.service';

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<typeof mongoose> =>
      await mongoose.connect(config.mongodbUrl, { useNewUrlParser: true }),
    inject: [ConfigService],
  },
];
