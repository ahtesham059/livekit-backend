import { Injectable } from '@nestjs/common';
import { DB } from 'src/database/database.provider';

import { BaseService } from '../base/base.service';
import { HealthDto } from './dto/app.dto';

@Injectable()
export class AppService extends BaseService {
  constructor(protected readonly db: DB) {
    super(db);
  }

  getHealth(): HealthDto {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
