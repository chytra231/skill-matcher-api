# Repo Briefing

## Projects
- `agent-registration/` — agent signs up, gets a personal shareable link.
- `insurance-proposal-form/` — customer fills out a proposal via an agent's link.
- `insurance-kyc-bot/` — older prototype, kept for reference only.

## Design Rules
- Theme: navy / royal-blue / white throughout.
- Each project is plain `index.html` + `style.css` + `script.js` (no build step, no frameworks).
- Forms use a chat-style flow: one question at a time, not a single long page.

## Technical Rules
- Submissions POST to a Google Apps Script URL via `fetch`.
- Always use `mode: "cors"` and `Content-Type: text/plain;charset=utf-8` (avoids preflight).
- Never assume success — check the actual HTTP status and response body, and show a
  real success or error message to the user based on that response.

## Data Rules
- Aadhar, PAN, and bank account numbers must be masked before sending: keep only the
  last 4 characters, replace the rest with `X`.

## Workflow Rules
- Always test changes in a headless browser (e.g. Playwright) before committing.
- Never push to `main` without asking the user first.
