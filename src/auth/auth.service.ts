import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { and, eq, isNull } from 'drizzle-orm';
import { BaseService } from 'src/base/base.service';
import { DB } from 'src/database/database.provider';
import { users } from 'src/database/schema';

import { LoginDto, LoginResponseDto, SignupDto, SignupResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    protected readonly db: DB,
    private readonly jwtService: JwtService,
  ) {
    super(db);
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await argon2.hash(password, {
      timeCost: saltOrRounds,
    });
  }

  async comparePassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }

  async signup(body: SignupDto): Promise<SignupResponseDto> {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, body.email), isNull(users.archivedAt)))
      .limit(1);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(body.password);

    await this.db.insert(users).values({
      ...body,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
    };
  }

  generateToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30d',
      },
    );
  }

  async login(body: LoginDto): Promise<LoginResponseDto> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, body.email), isNull(users.archivedAt)))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id, user.email);

    return {
      userId: user.id,
      token,
    };
  }
}
