import type { PrdSession } from '../types/session';
import { ROLES } from '../constants/roles';

interface Props {
  sessions: PrdSession[];
  onStartNew: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Dashboard({ sessions, onStartNew, onOpen, onDelete }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="screen-enter">
        <div className="empty-state">
          <div className="empty-state-icon">*</div>
          <h3>No PRDs yet</h3>
          <p>Start your first product requirements document.</p>
          <button className="btn btn-gold btn-big" onClick={onStartNew} type="button">
            Start New PRD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter">
      <div className="dashboard-header">
        <h2>My PRDs</h2>
        <button className="btn btn-gold" onClick={onStartNew} type="button">
          + New PRD
        </button>
      </div>
      <div className="session-list">
        {sessions.map((s) => {
          const contribRoles = Object.keys(s.contributions);
          const roleLabels = contribRoles
            .map((r) => ROLES.find((role) => role.id === r)?.icon || r)
            .join(' ');
          const date = new Date(s.updatedAt).toLocaleDateString();
          return (
            <div
              key={s.id}
              className="session-card"
              onClick={() => onOpen(s.id)}
            >
              <div className="session-card-info">
                <h3>{s.productName || 'Untitled PRD'}</h3>
                <div className="session-card-meta">
                  <span>Code: {s.code}</span>
                  <span>{contribRoles.length} role(s) {roleLabels}</span>
                  <span>{date}</span>
                  {s.prdMarkdown && <span style={{ color: 'var(--green)' }}>PRD Generated</span>}
                </div>
              </div>
              <div className="session-card-actions">
                <button
                  className="tbtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this PRD session?')) onDelete(s.id);
                  }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
