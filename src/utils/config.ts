import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = Object.freeze({
  DEBUG: process.env?.DEBUG?.toLowerCase?.() === 'true' ? true : false,
  DOCS_URI: process.env?.DOCS_API ?? 'apidocs',
  TOKEN: process.env?.TOKEN ?? '',
  PORT: parseInt(process.env?.PORT || '3000'),
  NAME: process.env?.NAME ?? 'Kaori',
});
