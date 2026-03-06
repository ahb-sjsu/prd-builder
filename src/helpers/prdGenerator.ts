import type { PrdSession, RoleId } from '../types/session';
import { QUESTIONS } from '../constants/questions';
import { ROLES } from '../constants/roles';

function buildPrompt(session: PrdSession): string {
  const compBlock =
    session.complianceData.frameworks.length > 0
      ? `COMPLIANCE FRAMEWORKS DETECTED: ${session.complianceData.frameworks.join(', ')}\nCompliance screening answers: ${JSON.stringify(session.complianceData.answers)}`
      : 'No specific compliance frameworks identified yet.';

  const contribBlock = Object.entries(session.contributions)
    .map(([role, answers]) => {
      const meta = ROLES.find((r) => r.id === role);
      if (!meta || !answers) return '';
      const lines = Object.entries(answers)
        .map(([k, v]) => {
          const q = QUESTIONS[role]?.find((q) => q.id === k);
          const label = q ? q.text : k;
          const val = Array.isArray(v) ? v.join(', ') : v;
          return `  [${label}]\n  ${val}`;
        })
        .join('\n\n');
      return `=== CONTRIBUTOR: ${meta.label} ===\n${lines}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return `You are an expert product manager and technical writer specializing in justice and law enforcement software.

${compBlock}

The following PRD questionnaire was completed by ${Object.keys(session.contributions).length} contributor(s):

${contribBlock}

Write a complete, professional Product Requirements Document. Synthesize all contributions. Where different roles answered the same question differently, reconcile them or note the distinction. Fill in reasonable professional assumptions for any gaps.

For any detected compliance frameworks, include a dedicated compliance section with specific, actionable requirements -- but always note that final requirements must be confirmed with the governing agency or CSA. Explain compliance implications in plain language where possible.

OUTPUT SECTIONS (include ALL of these):
## 1. Executive Summary
## 2. Product Vision & Goals
## 3. Users & Personas
## 4. User Workflows
## 5. Functional Requirements (Actor + Action + Condition, numbered FR-001...)
## 6. Non-Functional Requirements (measurable, numbered NFR-001...)
## 7. Core Data Model
## 8. Decision Logic & Business Rules
## 9. Compliance & Security Requirements
## 10. System Integrations
## 11. Assumptions
## 12. Known Risks
## 13. Out of Scope
## 14. Constraints
## 15. Stakeholders & Approval
## 16. Acceptance Criteria
## 17. Success Metrics & KPIs
## 18. Glossary
## 19. Dependencies
## 20. Deployment & Migration Plan

FORMATTING RULES:
- Every Functional Requirement MUST follow Actor + Action + Condition format.
- Every Non-Functional Requirement MUST include a measurable criterion where possible.
- Do NOT invent facts not provided by contributors.
- If information is missing or unclear, add it to Assumptions (Section 11).
- Clearly distinguish CONFIRMED from INFERRED/ASSUMED items.

Today: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`;
}

export async function generateWithAI(
  session: PrdSession,
  apiKey: string,
  onStatus?: (msg: string) => void,
): Promise<string> {
  const prompt = buildPrompt(session);

  onStatus?.('Sending to Claude...');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 5000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `API error ${res.status}: ${(err as { error?: { message?: string } })?.error?.message || res.statusText}`,
    );
  }

  const data = await res.json();
  const md = ((data as { content?: { text?: string }[] }).content?.[0]?.text || '').trim();

  if (!md || md.length < 500) {
    throw new Error(
      'The AI returned an incomplete response. Please try again.',
    );
  }

  return md;
}

export function generateTemplate(session: PrdSession): string {
  const name = session.productName || 'Product';
  const roles = Object.keys(session.contributions) as RoleId[];
  const frameworks = session.complianceData.frameworks;

  const sections: string[] = [];

  sections.push(`# ${name} -- Product Requirements Document\n`);
  sections.push(`## 1. Executive Summary\n`);

  const founderSummary = session.contributions.founder?.summary;
  const pmSummary = session.contributions.pm?.summary;
  const summary = pmSummary || founderSummary || '[To be completed]';
  sections.push(`${summary}\n`);

  sections.push(`## 2. Product Vision & Goals\n`);
  const problem = session.contributions.founder?.problem;
  if (problem) sections.push(`**Problem Statement:** ${problem}\n`);
  const success =
    session.contributions.founder?.success ||
    session.contributions.leo?.success;
  if (success) sections.push(`**Success Criteria:** ${success}\n`);

  sections.push(`## 3. Users & Personas\n`);
  const users =
    session.contributions.founder?.who_uses ||
    session.contributions.pm?.personas;
  if (users) sections.push(`${users}\n`);

  sections.push(`## 4. User Workflows\n`);
  for (const role of roles) {
    const wf = session.contributions[role]?.workflow;
    if (wf)
      sections.push(
        `### ${ROLES.find((r) => r.id === role)?.label || role} Perspective\n${wf}\n`,
      );
  }

  sections.push(`## 5. Functional Requirements\n`);
  for (const role of roles) {
    const mh = session.contributions[role]?.must_haves;
    if (mh) {
      const items = String(mh)
        .split(/[\n,.]/)
        .map((s) => s.trim())
        .filter(Boolean);
      items.forEach((item, i) => {
        sections.push(`- **FR-${String(i + 1).padStart(3, '0')}**: ${item}`);
      });
      sections.push('');
    }
  }

  sections.push(`## 6. Non-Functional Requirements\n`);
  const nfr = session.contributions.pm?.nfr || session.contributions.developer?.performance;
  if (nfr) sections.push(`${nfr}\n`);
  const uiux = session.contributions.pm?.ui_ux;
  if (uiux) sections.push(`**UI/UX:** ${uiux}\n`);
  const maint =
    session.contributions.pm?.maintenance || session.contributions.developer?.maintenance;
  if (maint) sections.push(`**Maintenance & Support:** ${maint}\n`);
  if (!nfr && !uiux && !maint) sections.push(`[To be defined based on project scope]\n`);

  sections.push(`## 7. Core Data Model\n`);
  const entities =
    session.contributions.developer?.key_entities ||
    session.contributions.pm?.key_entities ||
    session.contributions.developer?.data_model;
  if (entities) sections.push(`${entities}\n`);
  else sections.push(`[To be defined by technical team]\n`);

  sections.push(`## 8. Decision Logic & Business Rules\n`);
  for (const role of roles) {
    const br = session.contributions[role]?.business_rules;
    if (br) sections.push(`${br}\n`);
  }

  sections.push(`## 9. Compliance & Security Requirements\n`);
  if (frameworks.length > 0) {
    sections.push(
      `The following compliance frameworks have been identified: **${frameworks.join(', ')}**\n`,
    );
    sections.push(
      `All requirements must be confirmed with the governing agency or CSA.\n`,
    );
  }
  const security = session.contributions.developer?.security;
  if (security) sections.push(`${security}\n`);

  sections.push(`## 10. System Integrations\n`);
  for (const role of roles) {
    const integ =
      session.contributions[role]?.integrations ||
      session.contributions[role]?.existing_systems;
    if (integ) sections.push(`${integ}\n`);
  }
  const notif: string[] = [];
  for (const role of roles) {
    const n = session.contributions[role]?.notifications;
    if (n) notif.push(String(n));
  }
  if (notif.length > 0) sections.push(`**Notifications & Alerts:**\n${notif.join('\n')}\n`);

  sections.push(`## 11. Assumptions\n`);
  sections.push(`[To be validated with stakeholders]\n`);

  sections.push(`## 12. Known Risks\n`);
  const concerns = session.contributions.founder?.concerns;
  const risks =
    session.contributions.pm?.risks || session.contributions.developer?.risks;
  if (concerns) sections.push(`${concerns}\n`);
  if (risks) sections.push(`${risks}\n`);

  sections.push(`## 13. Out of Scope\n`);
  for (const role of roles) {
    const oos =
      session.contributions[role]?.not_allowed ||
      session.contributions[role]?.nice_to_haves;
    if (oos) sections.push(`${oos}\n`);
  }

  sections.push(`## 14. Constraints\n`);
  const constraints = session.contributions.developer?.constraints;
  const timeline =
    session.contributions.founder?.timeline ||
    session.contributions.pm?.timeline;
  if (constraints) sections.push(`${constraints}\n`);
  if (timeline) sections.push(`**Timeline:** ${timeline}\n`);
  const i18n = session.contributions.developer?.i18n;
  if (i18n) sections.push(`**Internationalization:** ${i18n}\n`);

  sections.push(`## 15. Stakeholders & Approval\n`);
  const approvers =
    session.contributions.founder?.who_approves ||
    session.contributions.pm?.stakeholders;
  if (approvers) sections.push(`${approvers}\n`);

  sections.push(`## 16. Acceptance Criteria\n`);
  for (const role of roles) {
    const ac = session.contributions[role]?.acceptance_criteria;
    if (ac) {
      const meta = ROLES.find((r) => r.id === role);
      sections.push(`### ${meta?.label || role}\n${ac}\n`);
    }
  }

  sections.push(`## 17. Success Metrics & KPIs\n`);
  const kpis =
    session.contributions.pm?.success_metrics ||
    session.contributions.founder?.success_metrics;
  if (kpis) sections.push(`${kpis}\n`);
  else sections.push(`[To be defined with measurable baselines and targets]\n`);

  sections.push(`## 18. Glossary\n`);
  const glossaryEntries: string[] = [];
  for (const role of roles) {
    const g = session.contributions[role]?.glossary;
    if (g) glossaryEntries.push(String(g));
  }
  if (glossaryEntries.length > 0) sections.push(`${glossaryEntries.join('\n\n')}\n`);
  else sections.push(`[To be compiled from domain experts]\n`);

  sections.push(`## 19. Dependencies\n`);
  const deps: string[] = [];
  for (const role of roles) {
    const d = session.contributions[role]?.dependencies;
    if (d) deps.push(String(d));
  }
  if (deps.length > 0) sections.push(`${deps.join('\n\n')}\n`);
  else sections.push(`[No external dependencies identified yet]\n`);

  sections.push(`## 20. Deployment & Migration Plan\n`);
  const deploy =
    session.contributions.pm?.deployment ||
    session.contributions.developer?.deployment;
  if (deploy) sections.push(`**Deployment Strategy:** ${deploy}\n`);
  const migration =
    session.contributions.pm?.data_migration ||
    session.contributions.developer?.data_migration ||
    session.contributions.leo?.data_migration;
  if (migration) sections.push(`**Data Migration:** ${migration}\n`);
  if (!deploy && !migration)
    sections.push(`[To be defined based on infrastructure and legacy systems]\n`);

  return sections.join('\n');
}
