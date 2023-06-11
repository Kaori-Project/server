export enum DiscordUsersErrorCodes {
  UnknownUser = 10013,
}

export interface ISerializedUser {
  id: string;
  bot: boolean;
  system: boolean;
  flags: string[];
  username: string;
  discriminator: string;
  avatar: string;
  banner: string;
  accentColor: number;
  createdTimestamp: number;
  defaultAvatarURL: string;
  hexAccentColor: string;
  tag: string;
  avatarURL: string;
  displayAvatarURL: string;
  bannerURL: string;
}
