import { useState } from 'react';
import { useSettings } from '../../settings/useSettings';
import { usePlan } from '../../plan/usePlan';

const BRAND_COLORS = [
  { color: '#e8a020', name: 'Gold' },
  { color: '#4a9eff', name: 'Blue' },
  { color: '#3fb950', name: 'Green' },
  { color: '#bc8cff', name: 'Purple' },
  { color: '#f85149', name: 'Red' },
];

const COMPLIANCE_FRAMEWORKS = [
  { key: 'CJIS', label: 'CJIS Security Policy' },
  { key: 'FedRAMP', label: 'FedRAMP' },
  { key: 'StateRAMP', label: 'StateRAMP' },
  { key: 'CISA CPGs', label: 'CISA Cybersecurity Performance Goals' },
  { key: 'CMMC', label: 'CMMC' },
  { key: 'TX-RAMP', label: 'TX-RAMP (Texas)' },
  { key: 'HIPAA', label: 'HIPAA' },
  { key: 'SOC2', label: 'SOC 2 Type II' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: Props) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { tier, setTier } = usePlan();
  const [newQuestion, setNewQuestion] = useState('');

  const addCustomQuestion = () => {
    const q = newQuestion.trim();
    if (!q) return;
    updateSettings({
      customQuestions: [...settings.customQuestions, q],
    });
    setNewQuestion('');
  };

  const removeCustomQuestion = (idx: number) => {
    updateSettings({
      customQuestions: settings.customQuestions.filter((_, i) => i !== idx),
    });
  };

  const toggleCompliance = (key: string) => {
    const next = settings.defaultCompliance.includes(key)
      ? settings.defaultCompliance.filter((k) => k !== key)
      : [...settings.defaultCompliance, key];
    updateSettings({ defaultCompliance: next });
  };

  return (
    <>
      <div
        className={`settings-overlay${open ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`settings-panel${open ? ' open' : ''}`}>
        <div className="sp-header">
          <div className="sp-title">Settings</div>
          <button className="sp-close" onClick={onClose} type="button">
            X
          </button>
        </div>
        <div className="sp-body">
          {/* Plan */}
          <div className="sp-section">
            <div className="sp-section-title">Plan</div>
            <div className="sp-field">
              <label className="sp-label">Current Plan</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className={`btn ${tier === 'free' ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setTier('free')}
                  type="button"
                >
                  Free
                </button>
                <button
                  className={`btn ${tier === 'pro' ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setTier('pro')}
                  type="button"
                >
                  Pro
                </button>
              </div>
            </div>
          </div>

          {/* API Key */}
          <div className="sp-section">
            <div className="sp-section-title">AI Generation</div>
            <div className="sp-field">
              <label className="sp-label">Anthropic API Key</label>
              <input
                className="sp-input"
                type="password"
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="sk-ant-..."
              />
              <div className="sp-hint">
                Required for AI-powered PRD generation (Pro plan). Your key is
                stored locally and never sent to our servers.
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="sp-section">
            <div className="sp-section-title">Branding</div>
            <div className="sp-field">
              <label className="sp-label">Company / Organization Name</label>
              <input
                className="sp-input"
                value={settings.company}
                onChange={(e) => updateSettings({ company: e.target.value })}
                placeholder="e.g. Justice Innovations"
              />
            </div>
            <div className="sp-field">
              <label className="sp-label">Platform Name</label>
              <input
                className="sp-input"
                value={settings.platname}
                onChange={(e) => updateSettings({ platname: e.target.value })}
                placeholder="e.g. PRD Builder"
              />
            </div>
            <div className="sp-field">
              <label className="sp-label">Brand Color</label>
              <div className="color-row">
                {BRAND_COLORS.map((c) => (
                  <div
                    key={c.color}
                    className={`color-swatch${settings.brandColor === c.color ? ' active' : ''}`}
                    style={{ background: c.color }}
                    onClick={() => updateSettings({ brandColor: c.color })}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Role Names */}
          <div className="sp-section">
            <div className="sp-section-title">Role Names</div>
            <div className="sp-hint" style={{ marginBottom: 10 }}>
              Rename roles to match your organization.
            </div>
            {(
              [
                ['founder', 'Founder / Entrepreneur'],
                ['pm', 'Product Manager / COO'],
                ['developer', 'Developer / Tech Lead'],
                ['leo', 'Law Enforcement / Agency'],
              ] as const
            ).map(([key, placeholder]) => (
              <div className="sp-field" key={key}>
                <input
                  className="sp-input"
                  value={settings.roleNames[key]}
                  onChange={(e) =>
                    updateSettings({
                      roleNames: {
                        ...settings.roleNames,
                        [key]: e.target.value,
                      },
                    })
                  }
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Default Compliance */}
          <div className="sp-section">
            <div className="sp-section-title">Default Compliance Frameworks</div>
            <div className="sp-hint" style={{ marginBottom: 10 }}>
              Pre-flag frameworks that typically apply to your products.
            </div>
            {COMPLIANCE_FRAMEWORKS.map((fw) => (
              <label
                key={fw.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '5px 0',
                  fontSize: 13,
                  color: 'var(--mid)',
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.defaultCompliance.includes(fw.key)}
                  onChange={() => toggleCompliance(fw.key)}
                  style={{ accentColor: 'var(--brand-primary)' }}
                />
                {fw.label}
              </label>
            ))}
          </div>

          {/* Custom Questions */}
          <div className="sp-section">
            <div className="sp-section-title">Custom Questions</div>
            <div className="sp-hint" style={{ marginBottom: 10 }}>
              Add questions that appear for all roles.
            </div>
            {settings.customQuestions.map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: '10px 12px',
                  marginBottom: 8,
                }}
              >
                <span style={{ flex: 1, fontSize: 13, color: 'var(--mid)' }}>
                  {q}
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--dim)',
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                  onClick={() => removeCustomQuestion(i)}
                  type="button"
                >
                  X
                </button>
              </div>
            ))}
            <textarea
              className="sp-input"
              rows={2}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type a custom question..."
              style={{ marginBottom: 6 }}
            />
            <button
              className="btn btn-ghost"
              onClick={addCustomQuestion}
              style={{ fontSize: 13, padding: '7px 16px' }}
              type="button"
            >
              + Add Question
            </button>
          </div>

          <div
            style={{
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (confirm('Reset all settings to defaults?')) resetSettings();
              }}
              style={{ width: '100%', fontSize: 13 }}
              type="button"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
