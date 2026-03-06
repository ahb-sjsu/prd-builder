# PRD Builder

Build professional, standards-aligned Product Requirements Documents through guided questionnaires -- no technical knowledge needed.

**[Use PRD Builder](https://ahb-sjsu.github.io/prd-builder/)**

## How It Works

1. **Start a new PRD** -- click "Start New PRD" on the home page
2. **Compliance screening** -- answer simple yes/no questions to detect requirements like CJIS, FedRAMP, HIPAA
3. **Pick your role** -- Founder, Product Manager, Developer, or Law Enforcement. Each gets tailored questions.
4. **Answer questions** -- guided flow with examples and hints at every step
5. **Invite your team** -- share the 6-character session code so teammates can add their perspective
6. **Generate your PRD** -- get a complete, structured document ready to hand to developers

## Standards Alignment

PRD Builder's questionnaire and output structure are aligned with established software engineering standards:

- **ISO/IEC/IEEE 29148:2018** -- the current international standard for requirements engineering (supersedes IEEE 830)
- **IEEE 830-1998** -- the classic recommended practice for software requirements specifications
- **Industry best practices** -- from Atlassian, Perforce, Inflectra, and Reforge PRD frameworks

Every generated PRD includes 20 sections covering:

| Sections 1--10 | Sections 11--20 |
|---|---|
| Executive Summary | Assumptions |
| Product Vision & Goals | Known Risks |
| Users & Personas | Out of Scope |
| User Workflows | Constraints |
| Functional Requirements (numbered) | Stakeholders & Approval |
| Non-Functional Requirements (measurable) | Acceptance Criteria |
| Core Data Model | Success Metrics & KPIs |
| Decision Logic & Business Rules | Glossary |
| Compliance & Security Requirements | Dependencies |
| System Integrations | Deployment & Migration Plan |

## Features

- **Standards-based questionnaire** -- 88 questions across 4 roles, mapped to ISO 29148 and IEEE 830
- **Role-based questions** -- 4 roles, each with questions suited to their expertise
- **Compliance detection** -- automatically flags CJIS, FedRAMP, HIPAA, CMMC, StateRAMP, and more
- **Team collaboration** -- share a session code and multiple people contribute to one PRD
- **AI or template generation** -- generate with Claude AI (Pro) or use structured templates (Free)
- **Export to Word** -- download your PRD as a .doc file (Pro)
- **Custom branding** -- add your company name, colors, and role labels (Pro)
- **Private by design** -- all data stays in your browser. Nothing is stored on any server.

## Pricing

| | Free | Pro ($19/mo) |
|---|---|---|
| PRD sessions | 2 | Unlimited |
| All roles & compliance screening | Yes | Yes |
| Team session sharing | Yes | Yes |
| PRD generation | Template | AI-powered (Claude) |
| Word doc export | -- | Yes |
| Custom branding & questions | -- | Yes |

To unlock Pro: click **Settings** in the app, switch to Pro, and enter your Anthropic API key.
Your key stays in your browser and is only used to call the Claude API directly.

## Privacy

- All your data is stored in your browser's local storage
- Nothing is sent to any server
- The only external call is to the Anthropic API when you generate a PRD with AI (Pro only), and that goes directly from your browser to Anthropic

---

## For Developers

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup, architecture, and contributing.

## License

BUSL-1.1
