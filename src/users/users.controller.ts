import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UsersErrorCodes } from './users.types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId')
  async getUserData(@Res() res: Response, @Param('userId') userId: string) {
    try {
      const userData = await this.usersService.getUserInfo(userId);
      res.status(HttpStatus.OK).json({ userData });
    } catch (err) {
      switch (err?.code) {
        case UsersErrorCodes.UnknownUser:
          res.status(HttpStatus.NOT_FOUND).json(err);
        default:
          throw err;
      }
    }
  }
}
