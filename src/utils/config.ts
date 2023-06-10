import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = Object.freeze({
  DEBUG: process.env?.DEBUG?.toLowerCase?.() === 'true' ? true : false,
  DOCS_URI: process.env?.DOCS_API ?? 'apidocs',
  TOKEN: process.env?.TOKEN ?? '',
  GUILD_ID: process.env?.GUILD_ID ?? '',
  PORT: parseInt(process.env?.PORT ?? '3000'),
});
