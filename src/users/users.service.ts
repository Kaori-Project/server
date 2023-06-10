import { Injectable } from '@nestjs/common';
import {
  Client,
  GatewayIntentBits,
  Guild,
  GuildMember,
  User,
} from 'discord.js';
import { CONFIG } from 'src/utils/config';
import { cacheFactory } from 'src/utils/requests';

const intents = [
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
];

@Injectable()
export class UsersService {
  private client: Client;
  private guild: Guild;
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
    try {
      const member = await this.getGuildMember(userId);
      const returnObj = {
        user: member.user,
        presence: member.presence,
      };
      this.requestCache.insert(cacheKey, returnObj);
      return returnObj;
    } catch (err) {
      throw err?.rawError;
    }
  }

  private async getGuildMember(userId: string, updateGuild = false) {
    if (!this.guild || updateGuild)
      this.guild = await this.client.guilds.fetch(CONFIG.GUILD_ID);
    const member = await this.guild.members.fetch(userId);
    return member;
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
