import * as path from 'path';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { createCache } from './cache';
import { CONFIG } from './config';

const cachedTemplates = createCache<HandlebarsTemplateDelegate<any>>(
  CONFIG.DEBUG,
);

export function getTemplateContent(templateName: string): string {
  const templatePath = path.resolve(
    __dirname,
    '../templates',
    `${templateName}.hbs`,
  );
  if (!fs.existsSync(templatePath)) return null;
  return fs.readFileSync(templatePath, { encoding: 'utf-8' });
}

export function getTemplate(templateName: string) {
  if (!cachedTemplates.has(templateName)) {
    const content = getTemplateContent(templateName);
    if (!content) throw new Error(`Template '${templateName}' does not exists`);
    const compiledTemplate = Handlebars.compile(content);
    cachedTemplates.set(templateName, compiledTemplate);
    return compiledTemplate;
  }
  return cachedTemplates.get(templateName);
}
