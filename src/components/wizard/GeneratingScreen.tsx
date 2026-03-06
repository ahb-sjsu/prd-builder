import { useState, useEffect } from 'react';

const LABELS = [
  'Analyzing all contributions...',
  'Drafting functional requirements...',
  'Building non-functional requirements...',
  'Adding compliance framework...',
  'Synthesizing all sections...',
  'Finalizing your PRD...',
];

export function GeneratingScreen() {
  const [labelIdx, setLabelIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setLabelIdx((i) => (i + 1) % LABELS.length);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="screen-enter">
      <div className="gen-wrap">
        <div className="spin" />
        <div className="gen-title">Building your PRD</div>
        <div className="gen-lbl">{LABELS[labelIdx]}</div>
        <p style={{ color: 'var(--dim)', fontSize: 13, marginTop: 14 }}>
          Usually 20-40 seconds
        </p>
      </div>
    </div>
  );
}
