import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';

import { TokenResponseDto } from './dto/live-kit.dto';
import { LivekitService } from './live-kit.service';

@Controller('livekit')
export class LiveKitController extends BaseController {
  constructor(private readonly livekitService: LivekitService) {
    super();
  }

  @Get('token')
  async getToken(@Query('userId') userId: string): Promise<TokenResponseDto> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return await this.livekitService.getToken(userId);
  }
}
