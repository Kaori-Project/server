import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { KaoriError } from 'src/utils/errors';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId')
  async getUserData(@Res() res: Response, @Param('userId') userId: string) {
    try {
      const userData = await this.usersService.getUserInfo(userId);
      res.status(HttpStatus.OK).json({ userData });
    } catch (err) {
      if (err instanceof KaoriError) res.status(err.status).json(err);
      else throw err;
    }
  }
}
