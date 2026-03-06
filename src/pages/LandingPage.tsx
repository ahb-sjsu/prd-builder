import { useState } from 'react';

interface Props {
  onStartNew: () => void;
  onJoinSession: (code: string) => boolean;
  onGoToDashboard: () => void;
  hasSessions: boolean;
}

export function LandingPage({
  onStartNew,
  onJoinSession,
  onGoToDashboard,
  hasSessions,
}: Props) {
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinErr, setJoinErr] = useState('');

  const handleJoin = () => {
    setJoinErr('');
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      setJoinErr('Please enter a 6-character code.');
      return;
    }
    if (!onJoinSession(code)) {
      setJoinErr('Session not found. Check the code and try again.');
    }
  };

  return (
    <div className="screen-enter">
      {/* Hero */}
      <div className="landing-hero">
        <div className="eyebrow">Product Development</div>
        <h1>
          Build Your Product
          <br />
          Requirements Document
        </h1>
        <p>
          Answer guided questions tailored to your role. One person or a whole
          team -- each contributor adds their piece. When ready, generate a
          complete PRD your developers can build from.
        </p>
        <div className="landing-cta">
          <button
            className="btn btn-gold btn-big"
            onClick={onStartNew}
            type="button"
          >
            Start New PRD
          </button>
          {hasSessions && (
            <button
              className="btn btn-ghost btn-big"
              onClick={onGoToDashboard}
              type="button"
            >
              My PRDs
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          maxWidth: 520,
          margin: '0 auto 40px',
        }}
      >
        <div className="acard" onClick={onStartNew}>
          <div className="acard-icon">*</div>
          <div className="acard-title">Start New PRD</div>
          <div className="acard-desc">
            Begin a new product document. About 10-15 minutes per role.
          </div>
        </div>
        <div className="acard" onClick={() => setShowJoin(!showJoin)}>
          <div className="acard-icon">+</div>
          <div className="acard-title">Join a Session</div>
          <div className="acard-desc">
            Have a session code? Enter it to add your contribution.
          </div>
        </div>
      </div>

      {showJoin && (
        <div className="join-area screen-enter">
          <div className="divider">Enter your 6-character session code</div>
          <div className="join-box">
            <input
              type="text"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. JX7K2M"
            />
            <button
              className="btn btn-gold"
              onClick={handleJoin}
              type="button"
            >
              Join
            </button>
          </div>
          <div className="join-err">{joinErr}</div>
        </div>
      )}

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-card-icon">*</div>
          <h3>Role-Based Questions</h3>
          <p>
            Tailored question sets for founders, product managers, developers,
            and end users. Each sees questions relevant to their expertise.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">+</div>
          <h3>Multi-Contributor</h3>
          <p>
            Share a session code with your team. Each person answers their
            section, and the PRD synthesizes all perspectives.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">~</div>
          <h3>Compliance Screening</h3>
          <p>
            Automatic detection of CJIS, FedRAMP, HIPAA, and other compliance
            requirements. Flags appear throughout the questionnaire.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">&gt;</div>
          <h3>AI-Powered Generation</h3>
          <p>
            Generate a professional PRD document from your answers using Claude
            AI. Export to Word or share directly.
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="pricing-section">
        <h2>Simple Pricing</h2>
        <p>Start free. Upgrade when you need more.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-card-name">Free</div>
            <div className="pricing-card-price">
              $0 <span>forever</span>
            </div>
            <ul className="pricing-features">
              <li>2 PRD sessions</li>
              <li>All 4 role types</li>
              <li>Compliance screening</li>
              <li>Template-based PRD output</li>
              <li>Session sharing</li>
              <li className="disabled">AI-powered generation</li>
              <li className="disabled">Word doc export</li>
              <li className="disabled">Custom branding</li>
            </ul>
            <button
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={onStartNew}
              type="button"
            >
              Get Started
            </button>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-card-name">Pro</div>
            <div className="pricing-card-price">
              $19 <span>/month</span>
            </div>
            <ul className="pricing-features">
              <li>Unlimited PRD sessions</li>
              <li>All 4 role types</li>
              <li>Compliance screening</li>
              <li>AI-powered PRD generation</li>
              <li>Word doc export</li>
              <li>Custom branding & colors</li>
              <li>Custom questions</li>
              <li>Priority support</li>
            </ul>
            <button
              className="btn btn-gold"
              style={{ width: '100%' }}
              onClick={onStartNew}
              type="button"
            >
              Start Pro Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
