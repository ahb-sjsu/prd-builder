export interface PrdSession {
  id: string;
  code: string;
  productName: string;
  contributions: Partial<Record<RoleId, Record<string, string | string[]>>>;
  complianceData: {
    answers: Record<string, string>;
    frameworks: string[];
  };
  prdMarkdown?: string;
  prdHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export type RoleId = 'founder' | 'pm' | 'developer' | 'leo';

export interface RoleMeta {
  id: RoleId;
  label: string;
  color: string;
  icon: string;
  description: string;
}

export type QuestionType = 'text' | 'textarea' | 'single' | 'multi';

export interface Question {
  id: string;
  sect: string;
  type: QuestionType;
  text: string;
  hint?: string;
  ex?: { l: string; t: string };
  choices?: string[];
  required?: boolean;
}

export interface ScreenerQuestion {
  id: string;
  text: string;
  hint?: string;
  yesFlags: string[];
}

export interface FrameworkInfo {
  icon: string;
  level: 'warn' | 'info' | 'note';
  name: string;
  desc: string;
  impact: string;
}

export interface ComplianceNudge {
  frameworks: string[];
  text: string;
}
