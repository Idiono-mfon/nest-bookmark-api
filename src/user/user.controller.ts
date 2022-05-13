import { EditUserDto } from './dto/edit-user';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { JwtGuard } from './../guard/jwt.guard';
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Patch,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GetUser } from '../decorator';

// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
//guards are used in the controller level as like middlewares.
//   Here the goal is to decode the user access token and retrieve the user object
// Then pass the user object into the request else return 401 unauthorized
// This guard access to the entire methods o fthe controller
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    //   @GetUser() is custom decorator to retrieve the user object being passed unto the reqest object
    //   @Req() req: Request, @Res() res: Response
    //   console.log(req.user);

    // @GetUser('email') email: string, // for retrieving user email object alone

    // console.log(email);

    return user;
    // return 'This is a single user information';
  }

  // HttpCode(HttpStatus.)

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    // return this.userService.
    return this.userService.editUser(userId, dto);
  }
}
