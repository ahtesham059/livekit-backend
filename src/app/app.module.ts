import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { LiveKitModule } from 'src/live-kit/live-kit.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true }), LiveKitModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
