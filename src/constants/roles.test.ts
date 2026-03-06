import { describe, it, expect } from 'vitest';
import { ROLES, getRoleMeta } from './roles';

describe('ROLES', () => {
  it('has 4 roles', () => {
    expect(ROLES).toHaveLength(4);
  });

  it('has unique IDs', () => {
    const ids = ROLES.map((r) => r.id);
    expect(new Set(ids).size).toBe(4);
  });
});

describe('getRoleMeta', () => {
  it('returns meta for valid role', () => {
    expect(getRoleMeta('founder')?.label).toContain('Founder');
  });

  it('returns undefined for invalid role', () => {
    expect(getRoleMeta('invalid')).toBeUndefined();
  });
});
