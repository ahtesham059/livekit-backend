import { Controller, Get } from '@nestjs/common';

import { BaseController } from '../base/base.controller';
import { AppService } from './app.service';
import { HealthDto } from './dto/app.dto';
@Controller()
export class AppController extends BaseController {
  constructor(private readonly appService: AppService) {
    super();
  }

  @Get('health')
  getHealth(): HealthDto {
    return this.appService.getHealth();
  }
}
