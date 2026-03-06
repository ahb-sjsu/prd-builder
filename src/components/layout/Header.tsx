import type { PrdSession } from '../../types/session';

interface Props {
  platname: string;
  company: string;
  brandColor: string;
  session: PrdSession | null;
  progressInfo: { section: string; pct: number } | null;
  onLogoClick: () => void;
  onSettingsClick: () => void;
  onSwitchRole?: () => void;
  showDashboard: () => void;
}

export function Header({
  platname,
  company,
  session,
  progressInfo,
  onLogoClick,
  onSettingsClick,
  onSwitchRole,
  showDashboard,
}: Props) {
  const displayName = platname || 'PRD Builder';
  const mark = displayName[0].toUpperCase();

  return (
    <div className="hdr">
      <div className="hdr-in">
        <button className="logo" onClick={onLogoClick} type="button">
          <div className="lmark">{mark}</div>
          <div>
            <div className="lname">{displayName}</div>
            <div className="lsub">{company || 'Product Requirements'}</div>
          </div>
        </button>
        <div className="hdr-right">
          {progressInfo && (
            <div className="prog-wrap">
              <div className="prog-lbl">
                <span>{progressInfo.section}</span>
                <span>{progressInfo.pct}%</span>
              </div>
              <div className="prog-bar">
                <div
                  className="prog-fill"
                  style={{ width: `${progressInfo.pct}%` }}
                />
              </div>
            </div>
          )}
          {onSwitchRole && (
            <button className="hpill" onClick={onSwitchRole} type="button">
              Switch Role
            </button>
          )}
          {session && (
            <button
              className="hpill"
              onClick={showDashboard}
              title={`Session: ${session.code}`}
              type="button"
            >
              {session.code}
            </button>
          )}
          <button className="hpill" onClick={onSettingsClick} type="button">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
