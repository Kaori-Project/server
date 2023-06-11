import { Injectable } from '@nestjs/common';
import type { GuildMember, User } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { CONFIG } from 'src/utils/config';
import { KaoriError, KaoriErrorCodes } from 'src/utils/errors';
import { cacheFactory } from 'src/utils/requests';
import type { ISerializedUser } from './users.types';
import { DiscordUsersErrorCodes } from './users.types';

const intents = [
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
];

@Injectable()
export class UsersService {
  private client: Client;
  private requestCache = cacheFactory(1000);
  constructor() {
    this.client = new Client({ intents });
    this.setupBot();
  }

  async getUserInfo(userId: string): Promise<{
    user: ISerializedUser;
    presence: GuildMember['presence'];
  }> {
    const cacheKey = `getUserInfo-${userId}`;
    const cachedData = this.requestCache.get(cacheKey);
    if (cachedData) return cachedData;
    const member = await this.getGuildMember(userId);
    const returnObj = {
      user: this.serializeUser(member.user),
      presence: member.presence,
    };
    this.requestCache.insert(cacheKey, returnObj);
    return returnObj;
  }

  private async getGuildMember(
    userId: string,
    fetchUser = true,
  ): Promise<GuildMember> {
    for (const [, guild] of this.client.guilds.cache) {
      try {
        const member = await guild.members.fetch(userId);
        if (fetchUser) member.user = await this.getMemberUser(member);
        return member;
      } catch (err) {
        if (![DiscordUsersErrorCodes.UnknownUser].includes(err?.rawError?.code))
          throw err;
      }
      throw new KaoriError(KaoriErrorCodes.UserNotTracked);
    }
  }

  private async getMemberUser(member: GuildMember): Promise<User> {
    const user = await member?.user?.fetch?.();
    if (!user) return member.user;
    user.flags = user.flags || (await user.fetchFlags());
    return user;
  }

  private serializeUser(user: User): ISerializedUser {
    const flags = user?.flags?.toArray?.() ?? [];
    return { ...(user?.toJSON?.() as any), flags };
  }

  private async onReady(client: Client) {
    console.log(
      `Bot is Ready!\nID: ${client.user.id}\nUsername: ${client.user.username}`,
    );
  }

  private async setupBot() {
    this.client.on('ready', this.onReady);
    this.client.login(CONFIG.TOKEN);
  }
}
