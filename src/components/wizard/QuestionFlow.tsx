import { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS } from '../../constants/questions';
import { COMPLIANCE_NUDGES } from '../../constants/compliance';
import { getRoleMeta } from '../../constants/roles';
import type { PrdSession, RoleId, Question } from '../../types/session';

interface Props {
  session: PrdSession;
  role: RoleId;
  roleNames: Record<RoleId, string>;
  customQuestions: string[];
  detectedFrameworks: string[];
  onSave: (answers: Record<string, string | string[]>) => void;
  onProgressChange: (info: { section: string; pct: number } | null) => void;
  onBack: () => void;
}

export function QuestionFlow({
  session,
  role,
  customQuestions,
  detectedFrameworks,
  onSave,
  onProgressChange,
  onBack,
}: Props) {
  const meta = getRoleMeta(role);
  const questions: Question[] = [
    ...(QUESTIONS[role] || []),
    ...customQuestions.map((q, i) => ({
      id: `custom_${i}`,
      sect: 'Additional',
      type: 'textarea' as const,
      text: q,
      required: false,
    })),
  ];

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    () => ({ ...(session.contributions[role] || {}) }),
  );
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const q = questions[idx];
  const total = questions.length;
  const pct = Math.round(((idx + 1) / total) * 100);
  const isLast = idx === total - 1;

  useEffect(() => {
    onProgressChange({ section: q?.sect || '', pct });
    return () => onProgressChange(null);
  }, [idx, q, pct, onProgressChange]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [idx]);

  const capture = useCallback(() => {
    // Text/textarea are captured via onChange already
  }, []);

  const validate = useCallback((): boolean => {
    const val = answers[q.id] || '';

    // Must-haves: at least 3 items
    if (q.id === 'must_haves' && typeof val === 'string' && val.trim()) {
      const lines = val
        .split(/[\n,.]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (lines.length < 3) {
        setValidationMsg(
          'Try to list at least three features -- the more specific you are, the more useful the PRD will be.',
        );
        return false;
      }
    }

    // Users/personas: need detail
    if (
      (q.id === 'who_uses' || q.id === 'personas') &&
      typeof val === 'string' &&
      val.trim()
    ) {
      const words = val.trim().split(/\s+/);
      if (words.length < 6) {
        setValidationMsg(
          'Can you describe each user type in a bit more detail -- what they do, and what they need from the system?',
        );
        return false;
      }
    }

    setValidationMsg(null);
    return true;
  }, [answers, q]);

  const next = () => {
    capture();
    if (!validate()) return;
    if (isLast) {
      onSave(answers);
    } else {
      setIdx((i) => i + 1);
      setValidationMsg(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    capture();
    if (idx > 0) {
      setIdx((i) => i - 1);
      setValidationMsg(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  const skip = () => {
    setAnswers((a) => ({ ...a, [q.id]: '[skipped]' }));
    if (isLast) {
      onSave({ ...answers, [q.id]: '[skipped]' });
    } else {
      setIdx((i) => i + 1);
      setValidationMsg(null);
    }
  };

  const nudge = COMPLIANCE_NUDGES[q.id];
  const showNudge =
    nudge && detectedFrameworks.some((f) => nudge.frameworks.includes(f));

  const color = meta?.color || 'var(--brand-primary)';

  return (
    <div className="screen-enter">
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap' as const,
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '5px 13px',
            borderRadius: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: 'var(--dim)',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: color,
            }}
          />
          {meta?.label || role}
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: 'var(--dim)',
          }}
        >
          Question {idx + 1} of {total}
        </div>
      </div>

      {/* Question card */}
      <div className="qcard" style={{ '--qa': color } as React.CSSProperties}>
        <div className="q-sect">{q.sect}</div>
        <div className="q-text">{q.text}</div>
        {q.hint && <div className="q-hint">{q.hint}</div>}
        {q.ex && (
          <div className="q-ex">
            <strong>{q.ex.l}</strong>
            {q.ex.t}
          </div>
        )}

        {/* Input */}
        {q.type === 'text' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={(answers[q.id] as string) || ''}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
            }
            placeholder="Type your answer..."
            autoComplete="off"
          />
        )}

        {q.type === 'textarea' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={(answers[q.id] as string) || ''}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
            }
            placeholder="Type your answer..."
          />
        )}

        {q.type === 'single' && q.choices && (
          <div className="choices">
            {q.choices.map((c) => (
              <button
                key={c}
                type="button"
                className={`cbtn${answers[q.id] === c ? ' selected' : ''}`}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: c }))}
              >
                <span className="chk">
                  {answers[q.id] === c ? '\u2713' : ''}
                </span>
                {c}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multi' && q.choices && (
          <>
            <div className="choices">
              {q.choices.map((c) => {
                const sel = Array.isArray(answers[q.id])
                  ? (answers[q.id] as string[]).includes(c)
                  : false;
                return (
                  <button
                    key={c}
                    type="button"
                    className={`cbtn multi${sel ? ' selected' : ''}`}
                    onClick={() => {
                      const arr = Array.isArray(answers[q.id])
                        ? [...(answers[q.id] as string[])]
                        : [];
                      const i = arr.indexOf(c);
                      if (i === -1) arr.push(c);
                      else arr.splice(i, 1);
                      setAnswers((a) => ({ ...a, [q.id]: arr }));
                    }}
                  >
                    <span className="chk">{sel ? '\u2713' : ''}</span>
                    {c}
                  </button>
                );
              })}
            </div>
            <div className="multi-hint">Select all that apply</div>
          </>
        )}

        {/* Compliance nudge */}
        {showNudge && (
          <div className="comp-nudge">
            <div className="cn-label">Compliance Note</div>
            <div className="cn-text">{nudge.text}</div>
          </div>
        )}

        {/* Validation nudge */}
        {validationMsg && (
          <div className="val-nudge">
            <div className="vn-label">Helpful nudge</div>
            <div className="vn-text">{validationMsg}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 22,
        }}
      >
        <button className="btn btn-ghost" onClick={prev} type="button">
          Back
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {q.required === false && (
            <button className="skip-lnk" onClick={skip} type="button">
              Skip
            </button>
          )}
          <button className="btn btn-gold" onClick={next} type="button">
            {isLast ? 'Save My Section' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
