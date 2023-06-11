import { Injectable } from '@nestjs/common';
import type { GuildMember, User } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { CONFIG } from 'src/utils/config';
import { KaoriError, KaoriErrorCodes } from 'src/utils/errors';
import { cacheFactory } from 'src/utils/requests';
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
    user: User;
    presence: GuildMember['presence'];
  }> {
    const cacheKey = `getUserInfo-${userId}`;
    const cachedData = this.requestCache.get(cacheKey);
    if (cachedData) return cachedData;
    const member = await this.getGuildMember(userId);
    const returnObj = {
      user: member.user,
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
        if (fetchUser)
          member.user = (await member?.user?.fetch?.()) ?? member.user;
        return member;
      } catch (err) {
        if (![DiscordUsersErrorCodes.UnknownUser].includes(err?.rawError?.code))
          throw err;
      }
      throw new KaoriError(KaoriErrorCodes.UserNotTracked);
    }
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
