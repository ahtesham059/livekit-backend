import { Global, Module } from '@nestjs/common';

import { DatabaseAsyncProvider, databaseProvider } from './database.provider';

@Global()
@Module({
  providers: [...databaseProvider],
  exports: [DatabaseAsyncProvider],
})
export class DatabaseModule {}
