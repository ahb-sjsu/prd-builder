import type { RoleId } from './session';

export interface AppSettings {
  company: string;
  platname: string;
  brandColor: string;
  roleNames: Record<RoleId, string>;
  defaultCompliance: string[];
  customQuestions: string[];
  apiKey: string;
}
