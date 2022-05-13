import { AuthDto } from './dto/auth.dto';
import {
  ForbiddenException,
  Injectable,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * export interface Movie {
  id: number;
  name: string;
  year: number;
}

@Injectable()
export class AppService {
  private movies: Movie[] = [
    { id: 1, name: 'Star Wars: The Force Awakens', year: 2015 },
    { id: 2, name: 'Star Wars: The Last Jedi', year: 2017 },
    { id: 3, name: 'Star Wars: The Rise of Skywalker', year: 2019 },
  ];

  getMovies(): Movie[] {
    return this.movies;
  }
 */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // const { hash: userHash, ...data } = user;

      // return { ...data };
      return this.signToken(user.id, user.email);

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //P2002 is a custom duplicate record error generate by prisma
          throw new ForbiddenException('Credentials taken'); //nest js fprbidden exception
        }
      }

      throw error;
    }
  }
  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user)
      throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!pwMatches)
      throw new ForbiddenException('Credentials incorrect');

    // const { hash, ...requiredFields } = user;

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
