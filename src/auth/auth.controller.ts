import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
// import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    // @Req() req: Request
    return this.authservice.signUp(dto);
  }

  @HttpCode(HttpStatus.OK) //decorator for specifying a custom status code
  @Post('signin')
  signIn(
    @Body() dto: AuthDto,
  ): Promise<{ access_token: string }> {
    return this.authservice.signIn(dto);
  }
}
