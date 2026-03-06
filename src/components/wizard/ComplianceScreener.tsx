import { useCallback } from 'react';
import {
  SCREENER_QUESTIONS,
  FRAMEWORK_INFO,
} from '../../constants/compliance';

interface Props {
  answers: Record<string, string>;
  detectedFrameworks: string[];
  defaultCompliance: string[];
  onAnswer: (answers: Record<string, string>, frameworks: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ComplianceScreener({
  answers,
  detectedFrameworks,
  defaultCompliance,
  onAnswer,
  onContinue,
  onBack,
}: Props) {
  const handleAnswer = useCallback(
    (qid: string, val: string) => {
      const newAnswers = { ...answers, [qid]: val };
      const frameworks = [...defaultCompliance];
      SCREENER_QUESTIONS.forEach((q) => {
        if (
          newAnswers[q.id] === 'yes' ||
          newAnswers[q.id] === 'unsure'
        ) {
          q.yesFlags.forEach((f) => {
            if (!frameworks.includes(f)) frameworks.push(f);
          });
        }
      });
      onAnswer(newAnswers, frameworks);
    },
    [answers, defaultCompliance, onAnswer],
  );

  return (
    <div className="screen-enter">
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 24,
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          Quick Compliance Check
        </h2>
        <p style={{ fontSize: 14, color: 'var(--mid)', maxWidth: 580, lineHeight: 1.7 }}>
          Before we start, a few quick questions help us understand what
          compliance and security requirements will affect your product.{' '}
          <strong style={{ color: 'var(--text)' }}>
            No technical knowledge needed.
          </strong>
        </p>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--brand-primary)',
          borderRadius: 'var(--r)',
          padding: '20px 24px',
          marginBottom: 28,
        }}
      >
        <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--brand-primary)' }}>
            Why does this matter?
          </strong>{' '}
          Compliance requirements affect how software gets built -- the database
          design, where it is hosted, what security features are required, and
          how much it costs. Knowing early saves time and money.
        </p>
      </div>

      <div className="screener-qs">
        {SCREENER_QUESTIONS.map((q) => (
          <div className="sq" key={q.id}>
            <div className="sq-text">{q.text}</div>
            {q.hint && <div className="sq-hint">{q.hint}</div>}
            <div className="sq-opts">
              {['yes', 'no', 'unsure'].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`sq-opt${answers[q.id] === v ? ' selected' : ''}`}
                  onClick={() => handleAnswer(q.id, v)}
                >
                  {v === 'unsure' ? 'Not sure' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {detectedFrameworks.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--brand-primary)',
              marginBottom: 14,
            }}
          >
            Based on your answers, here is what to be aware of:
          </div>
          <div className="comp-flags">
            {detectedFrameworks.map((f) => {
              const info = FRAMEWORK_INFO[f];
              if (!info) return null;
              return (
                <div className={`cflag ${info.level}`} key={f}>
                  <div className="cflag-icon">{info.icon}</div>
                  <div>
                    <div className="cflag-name">{info.name}</div>
                    <div className="cflag-desc">{info.desc}</div>
                    <div className="cflag-impact">{info.impact}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
          flexWrap: 'wrap' as const,
          gap: 12,
        }}
      >
        <button className="btn btn-ghost" onClick={onBack} type="button">
          Back
        </button>
        <button className="btn btn-gold btn-big" onClick={onContinue} type="button">
          Continue to Questionnaire
        </button>
      </div>
    </div>
  );
}
