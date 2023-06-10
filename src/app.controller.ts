import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import './templates/appHome.hbs';

@Controller()
@UseGuards()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome() {
    return this.appService.getAppHome();
  }
}
