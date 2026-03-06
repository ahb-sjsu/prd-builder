export type PlanTier = 'free' | 'pro';

export interface PlanLimits {
  maxSessions: number;
  maxRolesPerSession: number;
}

export interface PlanFeatures {
  aiGeneration: boolean;
  wordExport: boolean;
  customBranding: boolean;
  customQuestions: boolean;
  allRoles: boolean;
  sessionSharing: boolean;
}

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  price: string;
  limits: PlanLimits;
  features: PlanFeatures;
}

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: '$0',
    limits: {
      maxSessions: 2,
      maxRolesPerSession: 2,
    },
    features: {
      aiGeneration: false,
      wordExport: false,
      customBranding: false,
      customQuestions: false,
      allRoles: true,
      sessionSharing: true,
    },
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price: '$19/mo',
    limits: {
      maxSessions: Infinity,
      maxRolesPerSession: Infinity,
    },
    features: {
      aiGeneration: true,
      wordExport: true,
      customBranding: true,
      customQuestions: true,
      allRoles: true,
      sessionSharing: true,
    },
  },
};
