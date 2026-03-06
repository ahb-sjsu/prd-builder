import { useMemo, useState } from 'react';
import { markdownToHtml } from '../helpers/markdown';
import { downloadAsWord } from '../helpers/download';
import { usePlan } from '../plan/usePlan';
import { useSettings } from '../settings/useSettings';
import { ROLES } from '../constants/roles';
import type { PrdSession } from '../types/session';

interface Props {
  session: PrdSession;
  onUpdateSession: (id: string, updates: Partial<PrdSession>) => void;
  onAddContributor: () => void;
  onStartNew: () => void;
  onRegenerate: () => void;
}

export function PrdView({
  session,
  onAddContributor,
  onStartNew,
  onRegenerate,
}: Props) {
  const { canUseFeature } = usePlan();
  const { settings } = useSettings();
  const [dlState, setDlState] = useState<'idle' | 'loading'>('idle');

  const prdHtml = useMemo(() => {
    if (!session.prdMarkdown) return '';

    const md = session.prdMarkdown;
    const name = session.productName || 'Product Requirements Document';
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const roles = Object.keys(session.contributions)
      .map((r) => ROLES.find((role) => role.id === r)?.label || r)
      .join(', ');

    const frameworks = session.complianceData.frameworks;
    const compBanner =
      frameworks.length > 0
        ? `<div class="comp-banner"><div class="comp-banner-title">Compliance Frameworks Identified</div><div class="comp-banner-text">This PRD incorporates requirements from: <strong>${frameworks.join(', ')}</strong>. See Compliance & Security Requirements section for details. All requirements should be confirmed with the governing agency or CSA.</div></div>`
        : '';

    const bodyHtml = markdownToHtml(md);
    return `<h1>${name}</h1>
<div class="dmeta"><span>${settings.company || 'PRD Builder'}</span><span>Generated: ${date}</span><span>Contributors: ${roles || 'None'}</span></div>
${compBanner}${bodyHtml}`;
  }, [session, settings.company]);

  const handleDownload = () => {
    if (!canUseFeature('wordExport')) {
      alert('Word doc export is a Pro feature. Upgrade in Settings.');
      return;
    }
    setDlState('loading');
    setTimeout(() => {
      downloadAsWord(prdHtml, session.productName);
      setDlState('idle');
    }, 500);
  };

  if (!session.prdMarkdown) {
    return (
      <div className="screen-enter">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              fontWeight: 900,
              marginBottom: 10,
            }}
          >
            No PRD generated yet
          </h2>
          <p style={{ fontSize: 14, color: 'var(--dim)', marginBottom: 20 }}>
            Go back and answer questions, then generate your PRD.
          </p>
          <button
            className="btn btn-gold"
            onClick={onAddContributor}
            type="button"
          >
            Go to Questionnaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter">
      <div className="prd-bar">
        <div>
          <div className="ptl-tag">Product Requirements Document</div>
          <div className="ptl-name">
            {session.productName || 'Untitled'}
          </div>
        </div>
        <div className="tbar-btns">
          <button
            className="tbtn"
            onClick={onAddContributor}
            type="button"
          >
            + Add Contributor
          </button>
          <button
            className="tbtn"
            onClick={() => {
              if (confirm('Regenerate the PRD?')) onRegenerate();
            }}
            type="button"
          >
            Regenerate
          </button>
          <button className="tbtn" onClick={onStartNew} type="button">
            New PRD
          </button>
          <button
            className="tbtn tbtn-p"
            onClick={handleDownload}
            disabled={dlState === 'loading'}
            type="button"
          >
            {dlState === 'loading' ? 'Preparing...' : 'Download Word Doc'}
          </button>
        </div>
      </div>
      <div
        className="prd-doc"
        dangerouslySetInnerHTML={{ __html: prdHtml }}
      />
    </div>
  );
}
