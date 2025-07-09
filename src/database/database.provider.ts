import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

export const DatabaseAsyncProvider = 'DatabaseAsyncProvider';
export type DB = Awaited<ReturnType<typeof connectToDB>>;

export const connectToDB = (configService: ConfigService) => {
  const host = configService.get<string>('DATABASE_HOST');
  const port = configService.get<string>('DATABASE_PORT');
  const user = configService.get<string>('DATABASE_USER');
  const password = configService.get<string>('DATABASE_PASSWORD');
  const database = configService.get<string>('DATABASE_NAME');
  const ssl = configService.get<string>('DATABASE_SSL');

  const pool = new Pool({
    host,
    port: Number(port),
    user,
    password,
    database,
    ssl: ssl === 'true',
  });

  return drizzle(pool, { schema, logger: true }) as NodePgDatabase<typeof schema>;
};

export const databaseProvider = [
  {
    provide: DatabaseAsyncProvider,
    inject: [ConfigService],
    useFactory: connectToDB,
  },
];
