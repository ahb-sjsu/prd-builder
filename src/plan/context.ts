import { createContext } from 'react';
import type { PlanTier, PlanDefinition } from './plans';

export interface PlanContextValue {
  tier: PlanTier;
  plan: PlanDefinition;
  setTier: (tier: PlanTier) => void;
  canUseFeature: (feature: string) => boolean;
  isWithinLimit: (limitKey: string, current: number) => boolean;
}

export const PlanContext = createContext<PlanContextValue | null>(null);
