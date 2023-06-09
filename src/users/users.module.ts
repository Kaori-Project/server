import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersSerializers } from './users.serializers';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersSerializers],
})
export class UsersModule {}
