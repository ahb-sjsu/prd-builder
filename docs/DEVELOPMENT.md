# Development Guide

## Prerequisites

- Node.js 20+
- npm 9+

## Setup

```bash
git clone https://github.com/ahb-sjsu/prd-builder.git
cd prd-builder
npm install
npm run dev
```

Opens at http://localhost:5173/prd-builder/

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | TypeScript check + production build |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | TypeScript type checking only |
| `npm run format` | Format code with Prettier |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  App.tsx                    Main app shell, screen routing
  main.tsx                   Entry point with context providers
  index.css                  All styles (CSS variables for theming)

  types/
    session.ts               PrdSession, RoleId, Question types
    settings.ts              AppSettings type

  constants/
    questions.ts             All 4 role question banks (88 questions total)
    compliance.ts            Screener questions, framework info, nudges
    roles.ts                 Role metadata (id, label, color, icon)

  plan/
    plans.ts                 Free vs Pro feature flags and limits
    PlanContext.tsx           Plan tier state provider
    usePlan.ts               Hook to access plan tier

  settings/
    settingsDefaults.ts      Default settings values
    SettingsContext.tsx       Settings state provider (persists to localStorage)
    useSettings.ts           Hook to access settings

  hooks/
    useSessions.ts           Session CRUD (create, update, delete, find by code)

  helpers/
    prdGenerator.ts          AI generation (Claude API) and template generation
    markdown.ts              Markdown to HTML converter
    download.ts              Word doc export

  components/
    layout/
      Header.tsx             Top navigation bar
      SettingsPanel.tsx       Slide-out settings panel
    wizard/
      ComplianceScreener.tsx  Yes/no compliance questions
      RolePicker.tsx          Role selection with session status
      QuestionFlow.tsx        One-at-a-time question UI with validation
      SectionDone.tsx         Post-completion screen with session code
      GeneratingScreen.tsx    Loading spinner during PRD generation

  pages/
    LandingPage.tsx          Marketing page with features and pricing
    Dashboard.tsx            List of saved PRD sessions
    PrdWizard.tsx            Orchestrates the wizard steps
    PrdView.tsx              Rendered PRD output with toolbar
```

## Architecture

**No router.** Navigation is state-driven via the `AppScreen` type in `App.tsx`. Screens: `landing`, `dashboard`, `wizard` (with sub-steps), `prd`.

**No state library.** All state management uses React context + hooks:
- `PlanContext` -- free vs pro tier
- `SettingsContext` -- branding, API key, custom questions
- `useSessions` hook -- session CRUD with localStorage persistence

**No backend.** Everything runs in the browser. The only external call is to the Anthropic API when generating a PRD with AI (Pro tier), sent directly from the browser.

**Data storage:** localStorage with keys:
- `prd_plan_tier` -- current plan
- `prd_settings` -- app settings JSON
- `prd_sessions_index` -- array of session IDs
- `prd_sess_{id}` -- individual session JSON

## Standards Alignment

The questionnaire and PRD output are aligned with:

- **ISO/IEC/IEEE 29148:2018** -- requirements engineering (supersedes IEEE 830)
- **IEEE 830-1998** -- software requirements specifications
- **Industry PRD best practices** -- Atlassian, Perforce, Inflectra, Reforge

### Question Coverage by Role

| Role | Questions | Key Areas |
|---|---|---|
| Founder | 17 | Vision, users, features, acceptance criteria, KPIs, glossary, dependencies |
| Product Manager | 27 | Personas, functional/non-functional reqs, compliance, security, governance, deployment, UI/UX, maintenance |
| Developer | 25 | Architecture, data model, performance, integrations, acceptance tests, deployment, i18n, operations |
| Law Enforcement | 19 | Daily workflow, access control, data sensitivity, existing systems, data migration, notifications |

### PRD Output Sections (20 total)

| # | Section | Standard Source |
|---|---|---|
| 1 | Executive Summary | ISO 29148 §1 |
| 2 | Product Vision & Goals | ISO 29148 §2.1 |
| 3 | Users & Personas | ISO 29148 §2.3 |
| 4 | User Workflows | ISO 29148 §3 |
| 5 | Functional Requirements | ISO 29148 §3, IEEE 830 |
| 6 | Non-Functional Requirements | ISO 29148 §4 |
| 7 | Core Data Model | ISO 29148 §6.4 |
| 8 | Decision Logic & Business Rules | ISO 29148 §3 |
| 9 | Compliance & Security | ISO 29148 §4.2, §6.1 |
| 10 | System Integrations | ISO 29148 §5 |
| 11 | Assumptions | ISO 29148 §2.4 |
| 12 | Known Risks | Industry best practice |
| 13 | Out of Scope | Industry best practice |
| 14 | Constraints | ISO 29148 §2.4, §6.3 |
| 15 | Stakeholders & Approval | Industry best practice |
| 16 | Acceptance Criteria | ISO 29148 §7 |
| 17 | Success Metrics & KPIs | Industry best practice |
| 18 | Glossary | ISO 29148 §1.5, IEEE 830 |
| 19 | Dependencies | ISO 29148 §2.4 |
| 20 | Deployment & Migration Plan | ISO 29148 §6.2 |

### Adding Questions

When adding questions, assign them to the appropriate `sect` (section label shown in the wizard). Each question needs:

- `id` -- unique within the role, becomes the key in `session.contributions[role]`
- `sect` -- section grouping displayed in the wizard
- `type` -- `text`, `textarea`, `single`, or `multi`
- `text` -- the question itself
- `hint` (optional) -- help text shown below the question
- `ex` (optional) -- example with `l` (label) and `t` (text)
- `choices` (for `single`/`multi`) -- array of options
- `required` (optional) -- set `false` for optional questions (default is required)

If the question feeds a new PRD section, update both `buildPrompt()` (AI output) and `generateTemplate()` (free template) in `src/helpers/prdGenerator.ts`.

## Adding a New Role

1. Add the role to `RoleId` type in `src/types/session.ts`
2. Add role metadata in `src/constants/roles.ts`
3. Add questions in `src/constants/questions.ts`
4. Add default role name in `src/settings/settingsDefaults.ts`

## Adding Compliance Frameworks

1. Add screener question in `SCREENER_QUESTIONS` in `src/constants/compliance.ts`
2. Add framework info in `FRAMEWORK_INFO` in the same file
3. Optionally add nudges in `COMPLIANCE_NUDGES`

## UAT

See [UAT-CHECKLIST.md](UAT-CHECKLIST.md) for the full user acceptance testing checklist. Copy it for each release, fill in the version and date, and check off each item.

## Testing

Tests use Vitest with happy-dom. Run with `npm test`.

Test files live next to the code they test (e.g., `markdown.test.ts` next to `markdown.ts`).

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yaml`:

1. Lint (`eslint src/ --max-warnings 0`)
2. Type check (`tsc -b`)
3. Test (`vitest run`)
4. Build (`vite build`)
5. Deploy to GitHub Pages (main branch only)

## Deployment

GitHub Pages via GitHub Actions. To enable:

1. Go to repo **Settings > Pages**
2. Under Source, select **GitHub Actions**
3. Push to `main` -- CI handles the rest

The app is served from `/prd-builder/` (configured in `vite.config.ts` `base` option).

## License

BUSL-1.1
