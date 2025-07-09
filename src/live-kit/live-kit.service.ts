import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

import { TokenResponseDto } from './dto/live-kit.dto';

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;
  private logger = new Logger(LivekitService.name);
  private livekitApi: string;
  private livekitApiSecret: string;
  private livekitHost: string;

  constructor(private configService: ConfigService) {
    this.livekitApi = this.configService.get('LIVEKIT_API_KEY')!;
    this.livekitApiSecret = this.configService.get('LIVEKIT_API_SECRET')!;
    this.livekitHost = this.configService.get('LIVEKIT_HOST')!;

    if (!this.livekitApi || !this.livekitApiSecret || !this.livekitHost) {
      this.logger.error('LiveKit configuration is missing');
      throw new Error('LiveKit configuration is missing');
    }
    this.roomService = new RoomServiceClient(this.livekitHost, this.livekitApi, this.livekitApiSecret);
  }

  async createAccessToken({ identity, name }: { identity: string; name: string }, grant: any) {
    const token = new AccessToken(this.livekitApi, this.livekitApiSecret, {
      identity,
      name,
    });

    token.addGrant(grant);

    return await token.toJwt();
  }

  async getToken(userId: string): Promise<TokenResponseDto> {
    const roomName = randomUUID();
    await this.roomService.createRoom({ name: roomName });

    const grant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    };

    const token = await this.createAccessToken({ identity: userId, name: 'test' }, grant);

    return {
      token,
      roomName,
    };
  }
}
