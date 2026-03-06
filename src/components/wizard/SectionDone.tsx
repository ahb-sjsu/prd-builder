import { ROLES } from '../../constants/roles';
import type { PrdSession, RoleId } from '../../types/session';
import type { PlanTier } from '../../plan/plans';

interface Props {
  session: PrdSession;
  completedRole: RoleId | null;
  genError: string | null;
  tier: PlanTier;
  hasApiKey: boolean;
  onAddRole: () => void;
  onGenerate: () => void;
}

export function SectionDone({
  session,
  completedRole,
  genError,
  tier,
  hasApiKey,
  onAddRole,
  onGenerate,
}: Props) {
  const roleMeta = completedRole
    ? ROLES.find((r) => r.id === completedRole)
    : null;
  const contribCount = Object.keys(session.contributions).length;

  return (
    <div className="screen-enter">
      <div className="done-wrap">
        <div style={{ fontSize: 44, marginBottom: 18 }}>*</div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          {roleMeta ? `${roleMeta.label} section saved!` : 'Section saved!'}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--mid)',
            maxWidth: 500,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}
        >
          {contribCount > 1
            ? 'Multiple contributors have added sections. Generate the PRD or invite more.'
            : 'Your answers are saved. Share the code so others can contribute, or generate the PRD now.'}
        </p>

        {genError && (
          <div
            style={{
              background: 'rgba(248, 81, 73, 0.07)',
              border: '1px solid rgba(248, 81, 73, 0.25)',
              borderRadius: 'var(--r)',
              padding: '12px 16px',
              marginBottom: 20,
              maxWidth: 500,
              margin: '0 auto 20px',
              fontSize: 13,
              color: 'var(--red)',
              lineHeight: 1.5,
            }}
          >
            {genError}
          </div>
        )}

        <div className="done-contribs">
          {ROLES.map((r) => {
            const done = !!session.contributions[r.id];
            return (
              <div className={`dc${done ? ' has' : ''}`} key={r.id}>
                <div className="dc-icon">{r.icon}</div>
                <div className="dc-name">
                  {r.label.split('/')[0].trim()}
                </div>
                <div className="dc-st">
                  {done ? 'Complete' : 'Not yet'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="done-code-box">
          <div className="dcb-lbl">Session Code -- share with contributors</div>
          <div className="dcb-code">{session.code}</div>
          <button
            className="cpybtn"
            onClick={() => navigator.clipboard.writeText(session.code)}
            style={{ marginBottom: 8 }}
            type="button"
          >
            Copy Code
          </button>
          <div style={{ fontSize: 12, color: 'var(--dim)', lineHeight: 1.5 }}>
            Anyone with this code can enter it on the home screen to add their
            section.
          </div>
        </div>

        {tier === 'free' && !hasApiKey && (
          <div
            style={{
              background: 'rgba(188, 140, 255, 0.08)',
              border: '1px solid rgba(188, 140, 255, 0.25)',
              borderRadius: 'var(--r)',
              padding: '14px 18px',
              maxWidth: 500,
              margin: '0 auto 20px',
              fontSize: 13,
              color: 'var(--mid)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--purple)' }}>Free plan:</strong> Your
            PRD will use template-based generation. Upgrade to Pro and add your
            Anthropic API key in Settings for AI-powered generation.
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap' as const,
          }}
        >
          <button className="btn btn-ghost" onClick={onAddRole} type="button">
            + Add Another Role
          </button>
          <button
            className="btn btn-gold btn-big"
            onClick={onGenerate}
            type="button"
          >
            Generate PRD
          </button>
        </div>
      </div>
    </div>
  );
}
