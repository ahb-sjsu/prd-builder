# UAT Checklist

Use this checklist to verify each release of PRD Builder. Copy this file, fill in the release version and date, and check off each item as you test.

**Release:** _______________
**Date:** _______________
**Tester:** _______________
**Browser(s):** _______________

---

## 1. Landing Page

- [ ] Page loads without errors at https://ahb-sjsu.github.io/prd-builder/
- [ ] Hero section displays with "Start New PRD" and "Continue a Session" buttons
- [ ] Features grid displays all feature cards
- [ ] Pricing table shows Free vs Pro tiers with correct details
- [ ] "Join a Session" input accepts a 6-character code
- [ ] Settings gear icon is visible in the header

## 2. Compliance Screening

- [ ] Clicking "Start New PRD" begins the compliance screener
- [ ] All 6 screener questions display one at a time
- [ ] Yes / No / Unsure buttons work on each question
- [ ] Detected frameworks appear as tags (e.g., CJIS, FedRAMP, HIPAA)
- [ ] "Continue" button advances to role selection after all questions answered
- [ ] Skipping all questions (answering No) still allows proceeding

## 3. Role Selection

- [ ] All 4 role cards display: Founder, Product Manager, Developer, Law Enforcement
- [ ] Each card shows the correct icon and color
- [ ] Selecting a role highlights it and enables "Start Questions"
- [ ] Session code is visible and can be copied
- [ ] Contributor status grid shows which roles have been completed

## 4. Question Flow -- Founder (17 questions)

- [ ] Questions display one at a time with section headers
- [ ] Progress bar advances with each answer
- [ ] Text input works for short-answer questions (e.g., product name)
- [ ] Textarea input works for long-answer questions
- [ ] Examples and hints display where configured
- [ ] Required questions block advancing when empty
- [ ] Optional questions (e.g., nice_to_haves, edge_cases) can be skipped
- [ ] "Verification" section questions appear (acceptance criteria, success metrics)
- [ ] "Definitions" section question appears (glossary)
- [ ] Dependencies question appears under "The Organization"
- [ ] Compliance nudges display when relevant frameworks were detected
- [ ] Back button navigates to previous question without losing answers
- [ ] Completing all questions shows the "Section Done" screen

## 5. Question Flow -- Product Manager (27 questions)

- [ ] All PM-specific sections appear: Product Identity, Users & Personas, Functional Requirements, Non-Functional Requirements, Integrations, Compliance, Security, Governance
- [ ] Multi-select works for compliance framework question
- [ ] Acceptance criteria question appears in Functional Requirements
- [ ] Success metrics question appears in Governance
- [ ] Glossary question appears in Product Identity
- [ ] Dependencies, deployment questions appear in Governance
- [ ] Data migration, notifications questions appear in Integrations
- [ ] UI/UX, maintenance questions appear in Non-Functional Requirements
- [ ] All required questions enforce input before advancing

## 6. Question Flow -- Developer (25 questions)

- [ ] All Developer-specific sections appear: Scope, Architecture, Integrations, Security & Compliance, Data, Constraints, Functional Scope
- [ ] Multi-select works for compliance framework question
- [ ] Acceptance criteria question appears in Functional Scope
- [ ] Glossary question appears in Scope
- [ ] Deployment, maintenance questions appear in Architecture
- [ ] Data migration question appears in Data
- [ ] Notifications question appears in Integrations
- [ ] i18n question appears in Constraints
- [ ] Dependencies question appears in Functional Scope

## 7. Question Flow -- Law Enforcement (19 questions)

- [ ] All LEO-specific sections appear: About the Tool, The Problem Today, What You Need, Access & Security, Current Systems, Practicalities
- [ ] Single-select works (device environment, training time)
- [ ] Multi-select works (data sensitivity types)
- [ ] Acceptance criteria question appears in What You Need
- [ ] Glossary question appears in About the Tool
- [ ] Data migration question appears in Current Systems
- [ ] Notifications question appears in What You Need
- [ ] All optional questions can be skipped

## 8. Multi-Contributor Sessions

- [ ] After completing one role, "Add Another Role" returns to role picker
- [ ] Completed roles show a checkmark on the role picker
- [ ] Session code can be shared and entered on a different browser/device
- [ ] Joining via code loads the correct session with existing contributions
- [ ] Multiple roles' answers are preserved and merged into one PRD

## 9. PRD Generation -- Free Tier (Template)

- [ ] "Generate PRD" button appears after at least one role is completed
- [ ] Template PRD generates without errors
- [ ] Output contains all 20 numbered sections:
  - [ ] 1. Executive Summary
  - [ ] 2. Product Vision & Goals
  - [ ] 3. Users & Personas
  - [ ] 4. User Workflows
  - [ ] 5. Functional Requirements (numbered FR-001, FR-002...)
  - [ ] 6. Non-Functional Requirements
  - [ ] 7. Core Data Model
  - [ ] 8. Decision Logic & Business Rules
  - [ ] 9. Compliance & Security Requirements
  - [ ] 10. System Integrations
  - [ ] 11. Assumptions
  - [ ] 12. Known Risks
  - [ ] 13. Out of Scope
  - [ ] 14. Constraints
  - [ ] 15. Stakeholders & Approval
  - [ ] 16. Acceptance Criteria
  - [ ] 17. Success Metrics & KPIs
  - [ ] 18. Glossary
  - [ ] 19. Dependencies
  - [ ] 20. Deployment & Migration Plan
- [ ] Sections populated by contributor answers contain the correct data
- [ ] Sections without data show appropriate placeholder text
- [ ] UI/UX answers appear in section 6 (Non-Functional Requirements)
- [ ] Maintenance answers appear in section 6 (Non-Functional Requirements)
- [ ] Notification answers appear in section 10 (System Integrations)
- [ ] i18n answers appear in section 14 (Constraints)
- [ ] Compliance frameworks detected in screening appear in section 9

## 10. PRD Generation -- Pro Tier (AI)

- [ ] Switching to Pro tier in settings enables AI generation
- [ ] API key input is visible and accepts a key
- [ ] "Generate with AI" button calls the Claude API
- [ ] Loading screen shows with rotating status messages
- [ ] AI-generated PRD contains all 20 sections
- [ ] Functional requirements follow Actor + Action + Condition format
- [ ] Non-functional requirements include measurable criteria
- [ ] Compliance section includes actionable, framework-specific requirements
- [ ] Error message displays if API key is invalid or missing
- [ ] Error message displays if API call fails (e.g., network error)

## 11. PRD Output & Export

- [ ] Generated PRD renders as formatted HTML with proper headings
- [ ] Markdown formatting (bold, lists, tables) renders correctly
- [ ] "Add Contributor" button returns to role picker to add more input
- [ ] "Regenerate" button regenerates the PRD with current data
- [ ] "New PRD" button starts a fresh session
- [ ] Word doc export downloads a .doc file (Pro only)
- [ ] Exported Word doc contains the same content as the on-screen PRD
- [ ] Free tier shows upgrade prompt for Word export

## 12. Dashboard

- [ ] Dashboard lists all saved sessions
- [ ] Each session shows product name, session code, contributor count, date
- [ ] Sessions with a generated PRD show a "View PRD" indicator
- [ ] Clicking a session opens it (role picker or PRD view)
- [ ] Delete button removes the session after confirmation
- [ ] Free tier shows limit (2 sessions) and blocks creating more
- [ ] Pro tier allows unlimited sessions

## 13. Settings Panel

- [ ] Settings panel slides open from the right
- [ ] Plan toggle switches between Free and Pro
- [ ] API key field accepts and saves a key (Pro only)
- [ ] Company name field saves and persists
- [ ] Platform name field saves and persists
- [ ] Brand color picker changes the accent color across the app
- [ ] Role name overrides save and appear in the role picker
- [ ] Default compliance checkboxes save and pre-select in screening
- [ ] Custom questions section allows adding questions (Pro only)
- [ ] All settings persist after page refresh (localStorage)

## 14. Privacy & Data

- [ ] No network requests are made except to Anthropic API (Pro AI generation only)
- [ ] All session data is stored in localStorage (verify via browser dev tools)
- [ ] Clearing browser data removes all sessions and settings
- [ ] API key is stored only in localStorage, never sent to any server except Anthropic

## 15. Responsive Design

- [ ] App is usable at 1024px width (tablet landscape)
- [ ] App is usable at 768px width (tablet portrait)
- [ ] App is usable at 375px width (mobile)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Buttons and inputs are tap-friendly on mobile

## 16. Cross-Browser

- [ ] Chrome (latest) -- full test pass
- [ ] Firefox (latest) -- full test pass
- [ ] Safari (latest) -- full test pass
- [ ] Edge (latest) -- full test pass

---

## Sign-Off

| Role | Name | Date | Pass/Fail |
|---|---|---|---|
| Tester | | | |
| Product Owner | | | |
| Developer | | | |

**Notes:**

---

_Checklist version: 1.0 -- aligned with PRD Builder v1.0 (20 PRD sections, 88 questions, ISO/IEC/IEEE 29148:2018)_
