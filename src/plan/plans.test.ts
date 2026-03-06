import { describe, it, expect } from 'vitest';
import { PLANS } from './plans';

describe('PLANS', () => {
  it('has free and pro tiers', () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.pro).toBeDefined();
  });

  it('free tier has limited sessions', () => {
    expect(PLANS.free.limits.maxSessions).toBe(2);
  });

  it('pro tier has unlimited sessions', () => {
    expect(PLANS.pro.limits.maxSessions).toBe(Infinity);
  });

  it('free tier does not include AI generation', () => {
    expect(PLANS.free.features.aiGeneration).toBe(false);
  });

  it('pro tier includes AI generation', () => {
    expect(PLANS.pro.features.aiGeneration).toBe(true);
  });

  it('both tiers allow session sharing', () => {
    expect(PLANS.free.features.sessionSharing).toBe(true);
    expect(PLANS.pro.features.sessionSharing).toBe(true);
  });
});
