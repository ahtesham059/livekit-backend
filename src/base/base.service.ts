import { Inject, Injectable, Logger } from '@nestjs/common';

import { DatabaseAsyncProvider, DB } from '../database';

@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;
  protected constructor(
    @Inject(DatabaseAsyncProvider)
    protected readonly db: DB,
  ) {
    this.logger = new Logger(this.constructor.name);
  }
}
