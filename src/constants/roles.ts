import type { RoleMeta } from '../types/session';

export const ROLES: RoleMeta[] = [
  {
    id: 'founder',
    label: 'Founder / Entrepreneur',
    color: '#e8a020',
    icon: '\u{1F4A1}',
    description:
      'You have the vision. Plain-language questions, no jargon required.',
  },
  {
    id: 'pm',
    label: 'Product Manager / COO',
    color: '#4a9eff',
    icon: '\u{1F4CB}',
    description:
      'You bridge vision and execution -- users, priorities, timelines.',
  },
  {
    id: 'developer',
    label: 'Developer / Tech Lead',
    color: '#3fb950',
    icon: '\u{2699}\u{FE0F}',
    description:
      'Precise specs -- architecture, APIs, performance, security details.',
  },
  {
    id: 'leo',
    label: 'Law Enforcement / Agency',
    color: '#bc8cff',
    icon: '\u{1F535}',
    description:
      "You're the end user. Operational language -- what officers need.",
  },
];

export function getRoleMeta(id: string): RoleMeta | undefined {
  return ROLES.find((r) => r.id === id);
}
