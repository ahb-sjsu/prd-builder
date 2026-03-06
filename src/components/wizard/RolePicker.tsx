import { ROLES } from '../../constants/roles';
import type { PrdSession, RoleId } from '../../types/session';

interface Props {
  session: PrdSession;
  selectedRole: RoleId | null;
  roleNames: Record<RoleId, string>;
  onSelectRole: (role: RoleId) => void;
  onStart: () => void;
  onGenerate: () => void;
  onBack: () => void;
}

export function RolePicker({
  session,
  selectedRole,
  roleNames,
  onSelectRole,
  onStart,
  onGenerate,
  onBack,
}: Props) {
  const hasContributions = Object.keys(session.contributions).length > 0;

  return (
    <div className="screen-enter">
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 24,
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          Who is filling this out?
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--mid)',
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          Pick the role that best describes you. Your questions will be tailored
          to what you know. Switch roles any time or answer as multiple roles.
        </p>
      </div>

      {/* Session status */}
      {hasContributions && (
        <div className="sess-status">
          <div className="ss-title">Session Progress</div>
          <div className="ss-grid">
            {ROLES.map((r) => {
              const done = !!session.contributions[r.id];
              return (
                <div className="ss-item" key={r.id}>
                  <div className={`ss-dot${done ? ' done' : ''}`} />
                  {r.icon} {roleNames[r.id]?.split('/')[0]?.trim() || r.label.split('/')[0].trim()}
                </div>
              );
            })}
          </div>
          <div className="ss-code-row">
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  color: 'var(--dim)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  marginBottom: 3,
                }}
              >
                Share code
              </div>
              <div className="ss-code">{session.code}</div>
            </div>
            <button
              className="cpybtn"
              onClick={() => navigator.clipboard.writeText(session.code)}
              type="button"
            >
              Copy
            </button>
            <span style={{ fontSize: 12, color: 'var(--dim)', fontStyle: 'italic' }}>
              Send to teammates to add their section
            </span>
          </div>
        </div>
      )}

      <div className="role-grid">
        {ROLES.map((r) => {
          const done = !!session.contributions[r.id];
          const isSelected = selectedRole === r.id;
          const displayName = roleNames[r.id] || r.label;
          return (
            <div
              key={r.id}
              className={`rcard${isSelected ? ' selected' : ''}${done ? ' done' : ''}`}
              style={{ '--rc': r.color } as React.CSSProperties}
              onClick={() => onSelectRole(r.id)}
            >
              <div className="rc-icon">{r.icon}</div>
              <div className="rc-name">{displayName}</div>
              <div className="rc-desc">{r.description}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          gap: 12,
        }}
      >
        <button className="btn btn-ghost" onClick={onBack} type="button">
          Back
        </button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
          {hasContributions && (
            <button className="btn btn-ghost" onClick={onGenerate} type="button">
              Generate PRD Now
            </button>
          )}
          <button
            className="btn btn-gold btn-big"
            disabled={!selectedRole}
            onClick={onStart}
            type="button"
          >
            Start Questions
          </button>
        </div>
      </div>
    </div>
  );
}
