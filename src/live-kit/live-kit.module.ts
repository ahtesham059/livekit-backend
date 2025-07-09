import { Module } from '@nestjs/common';

import { LiveKitController } from './live-kit.controller';
import { LivekitService } from './live-kit.service';

@Module({
  controllers: [LiveKitController],
  providers: [LivekitService],
})
export class LiveKitModule {}
