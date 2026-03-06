import { usePlan } from './usePlan';

interface Props {
  feature: string;
  children?: React.ReactNode;
}

export function UpgradePrompt({ feature, children }: Props) {
  const { tier } = usePlan();
  if (tier === 'pro') return null;

  return (
    <div className="upgrade-prompt">
      <div className="upgrade-prompt-icon">*</div>
      <div className="upgrade-prompt-body">
        <div className="upgrade-prompt-title">Pro Feature</div>
        <div className="upgrade-prompt-text">
          {children || `${feature} is available on the Pro plan.`}
        </div>
      </div>
    </div>
  );
}
