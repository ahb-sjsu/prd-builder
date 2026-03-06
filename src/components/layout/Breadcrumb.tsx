import type { AppScreen, WizardStep } from '../../App';

interface Crumb {
  label: string;
  onClick?: () => void;
  active: boolean;
  dim: boolean;
}

const WIZARD_STEPS: { step: WizardStep; label: string }[] = [
  { step: 'compliance', label: 'Compliance' },
  { step: 'roles', label: 'Choose Role' },
  { step: 'questions', label: 'Questions' },
  { step: 'done', label: 'Review' },
];

interface Props {
  screen: AppScreen;
  productName?: string;
  onNavigate: (target: AppScreen) => void;
}

export function Breadcrumb({ screen, productName, onNavigate }: Props) {
  if (screen.page === 'landing') return null;

  const crumbs: Crumb[] = [];

  crumbs.push({
    label: 'Home',
    active: false,
    dim: false,
    onClick: () => onNavigate({ page: 'landing' }),
  });

  if (screen.page === 'dashboard') {
    crumbs.push({ label: 'My Sessions', active: true, dim: false });
  }

  if (screen.page === 'wizard') {
    const currentIdx = WIZARD_STEPS.findIndex((s) => s.step === screen.step);
    const effectiveIdx =
      screen.step === 'generating' ? WIZARD_STEPS.length : currentIdx;

    WIZARD_STEPS.forEach((s, i) => {
      crumbs.push({
        label: s.label,
        active: i === effectiveIdx,
        dim: i > effectiveIdx,
        onClick:
          i < effectiveIdx
            ? () => onNavigate({ page: 'wizard', step: s.step })
            : undefined,
      });
    });

    if (screen.step === 'generating') {
      crumbs.push({ label: 'Generating', active: true, dim: false });
    }
  }

  if (screen.page === 'prd') {
    crumbs.push({
      label: 'My Sessions',
      active: false,
      dim: false,
      onClick: () => onNavigate({ page: 'dashboard' }),
    });
    crumbs.push({
      label: productName || 'PRD',
      active: true,
      dim: false,
    });
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="bc-list">
        {crumbs.map((c, i) => (
          <li key={i} className="bc-item">
            {i > 0 && (
              <span className="bc-sep" aria-hidden="true">
                ›
              </span>
            )}
            {c.onClick ? (
              <button
                className="bc-link"
                onClick={c.onClick}
                type="button"
              >
                {c.label}
              </button>
            ) : (
              <span
                className={`bc-text${c.active ? ' bc-active' : ''}${c.dim ? ' bc-dim' : ''}`}
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
