# PRD Builder

Build professional Product Requirements Documents through guided questionnaires -- no technical knowledge needed.

**[Use PRD Builder](https://ahb-sjsu.github.io/prd-builder/)**

## How It Works

1. **Start a new PRD** -- click "Start New PRD" on the home page
2. **Compliance screening** -- answer simple yes/no questions to detect requirements like CJIS, FedRAMP, HIPAA
3. **Pick your role** -- Founder, Product Manager, Developer, or Law Enforcement. Each gets tailored questions.
4. **Answer questions** -- guided flow with examples and hints at every step
5. **Invite your team** -- share the 6-character session code so teammates can add their perspective
6. **Generate your PRD** -- get a complete, structured document ready to hand to developers

## Features

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

<details>
<summary>Development setup</summary>

```bash
npm install
npm run dev       # Dev server at localhost:5173/prd-builder/
npm test          # Run tests
npm run build     # Production build
npm run lint      # Lint
npm run typecheck # Type check
```

**Tech stack:** React 19, TypeScript 5.9, Vite 7, GitHub Pages

**Deployment:** Automatic via GitHub Actions on push to `main`. Enable GitHub Pages in repo Settings > Pages > Source: GitHub Actions.

</details>

## License

BUSL-1.1
