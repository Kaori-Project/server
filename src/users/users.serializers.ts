import { Injectable } from '@nestjs/common';
import type { GuildMember, User } from 'discord.js';
import type { ISerializedMember, ISerializedUser } from './users.types';

@Injectable()
export class UsersSerializers {
  guildMemberSerializer(member: GuildMember): ISerializedMember {
    return {
      user: this.userSerializer(member.user),
      presence: member.presence,
    };
  }

  userSerializer(user: User): ISerializedUser {
    const flags = user?.flags?.toArray?.() ?? [];
    return {
      ...(user?.toJSON?.() as any),
      flags,
    };
  }
}
