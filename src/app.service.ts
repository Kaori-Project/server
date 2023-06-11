import { Injectable } from '@nestjs/common';
import { CONFIG } from './utils/config';
import { getTemplate } from './utils/templates';

@Injectable()
export class AppService {
  getAppHome() {
    const appHomeTemplate = getTemplate('appHome');
    return appHomeTemplate({
      docsUri: CONFIG.DOCS_URI,
      name: CONFIG.NAME,
    });
  }
}
