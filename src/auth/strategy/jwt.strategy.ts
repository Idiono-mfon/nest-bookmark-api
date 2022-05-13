import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import { validate } from 'class-validator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt', //this is the key that is mapped to the strategy and will be called in our guards. You can decide to leave it blank
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // find single user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) return null;

    const { hash, ...requiredFields } = user;

    return requiredFields;

    // This will attach the payload to the req.user object
  }
}
