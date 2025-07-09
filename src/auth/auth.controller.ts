import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, SignupDto, SignupResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }
}
