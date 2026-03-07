import type { AppSettings } from '../types/settings';

export const DEFAULT_SETTINGS: AppSettings = {
  company: '',
  platname: 'PRD Builder',
  brandColor: '#66c2a5',
  roleNames: {
    founder: 'Founder / Entrepreneur',
    pm: 'Product Manager / COO',
    developer: 'Developer / Tech Lead',
    leo: 'Law Enforcement / Agency',
  },
  defaultCompliance: [],
  customQuestions: [],
  apiKey: '',
};
