import { useState, useCallback, type ReactNode } from 'react';
import { PlanContext } from './context';
import { PLANS, type PlanTier, type PlanFeatures, type PlanLimits } from './plans';

const STORAGE_KEY = 'prd_plan_tier';

function loadTier(): PlanTier {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pro') return 'pro';
  } catch {
    /* ignore */
  }
  return 'free';
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<PlanTier>(loadTier);

  const setTier = useCallback((t: PlanTier) => {
    setTierState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const plan = PLANS[tier];

  const canUseFeature = useCallback(
    (feature: string) => {
      return !!plan.features[feature as keyof PlanFeatures];
    },
    [plan],
  );

  const isWithinLimit = useCallback(
    (limitKey: string, current: number) => {
      const limit = plan.limits[limitKey as keyof PlanLimits];
      return limit === undefined || current < limit;
    },
    [plan],
  );

  return (
    <PlanContext value={{ tier, plan, setTier, canUseFeature, isWithinLimit }}>
      {children}
    </PlanContext>
  );
}
