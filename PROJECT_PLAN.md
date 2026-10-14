# Project Plan: Skill Matcher Job & Internship Platform

> **Status:** Plan only. No new code yet.
> **Written for:** a non-developer owner. Technical words are explained the first time they show up.

---

## 0. The big picture (in plain words)

```
 Candidate                     Website                        You (Admin)
 ─────────                     ───────                        ───────────
 Chats with the bot  ──►  Saves profile + skills
                                  │
                                  ▼
                          Matching engine  ◄──────  You post jobs every day
                                  │                         │
                                  ▼                         ▼
 Sees matched jobs   ◄──  Shows links + sends email   Company must be VERIFIED
                                                     (Claude researches it, fills a
                                                      scorecard, YOU approve/reject)
```

Only jobs from **verified** companies are ever shown or emailed to candidates.

### What already exists in this repository

The repository already has an early start:
- `backend/server.py`: the beginning of a **FastAPI** server (FastAPI is a Python tool for building the "back office" of a website). It is **unfinished**: the file stops halfway through.
- `backend/backend/requirements.txt`: a list of Python add-ons. It includes many add-ons we don't need, plus one (`emergentintegrations`) that only works on the Emergent platform.
- A test file and settings files, stored in oddly nested folders (`backend/backend/backend/...`).

**Decision:** we keep the same core choices (FastAPI and MongoDB) because they are good and free. Step 1 of the build cleans up the folders and finishes the file properly.

---

## 1. Recommended tech stack (beginner-friendly, free to host)

| Part | Choice | Why (one line) |
|---|---|---|
| **Backend** (the "brain" that stores data and runs logic) | **Python + FastAPI** | Already started in this repo, easy to read, and it builds a test page for every feature automatically (`/docs`). |
| **Database** (where all data is saved) | **MongoDB Atlas, free "M0" tier** | Already used by the repo; the free tier (512 MB) easily holds tens of thousands of profiles. |
| **Frontend** (the pages people see) | **React + Vite + Tailwind CSS** | The most common beginner path with the most tutorials, and Tailwind makes it look good without a designer. |
| **Chat-style registration bot** | **A scripted chat built in React** (no AI needed) | The questions are fixed, so a simple script is free, fast, and never says something wrong. |
| **Backend hosting** | **Render.com (free web service)** | Connects straight to GitHub and redeploys when you push changes. *Note: the free tier "sleeps" after 15 minutes idle, so the first visit takes about 30 seconds.* |
| **Frontend hosting** | **Vercel (free Hobby plan)** | One-click deploys from GitHub, fast worldwide, with free HTTPS. |
| **Emails** | **Brevo (free: 300 emails/day)** | Generous free limit with a simple setup. **Resend** (100/day free) is the backup option. |
| **Company research** | **Claude API with the built-in web search tool** | Searches the web, reads sources and fills the scorecard with links as proof. *This is the one part that is **not free**: it is pay-per-use, roughly a few US cents per company researched.* |
| **Admin login** | **Single admin email + password (stored encrypted) + login token (JWT)** | Simple and secure enough for one admin, with no paid login service. |
| **Resume storage** | **Resume link only** (Google Drive or any public link) | Avoids file-storage costs and complexity. File upload can come later. |
| **Daily scheduled jobs** (close expired jobs, send email digests) | **GitHub Actions scheduled workflow (free)** | Runs a small task every day at a set time, even while Render is asleep. |
| **Code storage** | **GitHub** (this repository) | Free, keeps every version, and Render and Vercel deploy from it. |

**Estimated monthly cost:** ₹0 for hosting, plus a small Claude API cost for company research (roughly ₹2–10 per company, depending on how much searching it does).

---

## 2. Data tables

> MongoDB calls tables **"collections"** and rows **"documents"**. This plan just says "tables" to keep it simple.
> Items marked **(suggested)** are things you didn't list that I recommend adding.

### 2.1 Candidates

| Field | Example | Notes |
|---|---|---|
| id **(suggested)** | auto | A unique ID for each person. |
| name | Priya Sharma | |
| phone | +91 98xxxxxx10 | |
| email | priya@gmail.com | Must be unique (one profile per email). |
| type | student / experienced | |
| qualification | B.Tech CSE | |
| college / university | VIT Vellore | |
| grade / CGPA | 8.4 | |
| graduation year | 2026 | |
| years of experience | 0 | 0 for students. |
| current company | — | Only if experienced. |
| current role | — | Only if experienced. |
| skills | Python, React, SQL | Stored as a list. |
| preferred location(s) | Bengaluru, Remote | **(suggested)** Allow more than one. |
| looking for | internship / job / both | **(suggested)** add "both". |
| resume link | drive.google.com/... | |
| expected stipend/salary **(suggested)** | ₹15,000/month | Avoids matching people to jobs that pay far below what they expect. |
| available from / notice period **(suggested)** | Jan 2027 / 30 days | Useful for internships and job switchers. |
| consent to store data & receive emails **(suggested)** | yes + date/time | **Important:** India's data protection law (DPDP Act, 2023) expects clear consent. |
| email verified **(suggested)** | yes/no | Stops fake or mistyped emails. |
| unsubscribed **(suggested)** | yes/no | Every email must have an unsubscribe link. |
| created date / updated date **(suggested)** | auto | |

### 2.2 Companies

| Field | Example | Notes |
|---|---|---|
| id **(suggested)** | auto | |
| name | Acme Tech Pvt Ltd | |
| website | acme.in | |
| LinkedIn URL | linkedin.com/company/acme | |
| registration / CIN number | U72900KA2019PTC123456 | |
| company status on registry **(suggested)** | Active / Struck off | Very important red flag check. |
| industry **(suggested)** | EdTech | |
| employee strength | 51–200 | |
| location (HQ) | Bengaluru | |
| founded year | 2019 | |
| funded | yes / no | |
| total funding | $4.5M | |
| latest funding round | Series A | |
| latest round date | Mar 2026 | |
| investors | Accel, Blume | List. |
| recent achievements | "Won NASSCOM award 2026" | List. |
| HR / contact email **(suggested)** | hr@acme.in | Check it is on the company domain, not Gmail. |
| red flags **(suggested)** | "asks candidates for fees" | List. Any red flag puts the company on hold. |
| source links **(suggested)** | list of URLs | Claude must show where each fact came from. |
| research summary **(suggested)** | short paragraph | Claude's plain-English summary. |
| research date **(suggested)** | auto | When Claude last researched it. |
| verification score | 78 / 100 | See Section 4. |
| score breakdown **(suggested)** | per-section points | So you can see *why* it scored 78. |
| status | pending / verified / rejected | |
| verified date | 2026-10-14 | |
| re-verify by **(suggested)** | 2027-04-14 | Re-check every 6 months. |
| admin notes | free text | |

### 2.3 Jobs / Internships

| Field | Example | Notes |
|---|---|---|
| id **(suggested)** | auto | |
| title | Frontend Developer Intern | |
| company | → link to a Company | Can only go "open" if the company is **verified**. |
| type | internship / job | |
| work mode **(suggested)** | onsite / remote / hybrid | |
| location | Pune | |
| stipend / salary | ₹20,000/month | **(suggested)** store min and max numbers so they can be compared. |
| duration | 6 months | Mainly for internships. |
| required skills | React, JavaScript | List. |
| nice-to-have skills **(suggested)** | TypeScript | Gives bonus points in matching but is never required. |
| min / max experience (years) **(suggested)** | 0–1 | |
| eligible graduation years **(suggested)** | 2026, 2027 | Very common filter for internships. |
| number of openings **(suggested)** | 3 | |
| description | text | |
| apply link | company careers page | |
| posted date | auto | |
| last date to apply | 2026-11-01 | Job auto-closes after this date. |
| status | draft **(suggested)** / open / closed | "Draft" lets you save a job while its company is still being verified. |

### 2.4 Matches

| Field | Example | Notes |
|---|---|---|
| id **(suggested)** | auto | |
| candidate | → link | |
| job | → link | |
| matched skills | React, JavaScript | |
| missing skills **(suggested)** | TypeScript | Helps candidates know what to learn. |
| match score **(suggested)** | 80% | Used to sort the best matches first. |
| date shared | 2026-10-14 | |
| shared via **(suggested)** | website / email | |
| email status **(suggested)** | sent / failed / bounced | |
| link clicked **(suggested)** | yes/no + date | Shows which jobs get interest. |
| candidate response **(suggested)** | applied / not interested | Optional buttons in the email or on the website. |

*Rule:* the same candidate is never sent the same job twice.

### 2.5 Extra tables (all suggested)

| Table | Purpose |
|---|---|
| **Admin users** | Your login (email + encrypted password). |
| **Skills list** | One master list of skill names plus alternative spellings ("JS" = "JavaScript", "ReactJS" = "React"). Without it, matching misses obvious matches. |
| **Chat sessions** | Saves a half-finished registration so a candidate who closes the tab can continue later. |
| **Email log** | Every email sent, to whom, and the result. Helps you stay under the free email limit and debug problems. |
| **Verification reports** | A full history of each Claude research run (raw findings plus sources), so re-checks can be compared with earlier ones. |

---

## 3. Website pages

### 3.1 Public pages (anyone can visit)

| Page | What it does |
|---|---|
| **Home** | Explains the platform, has a "Find my internship/job" button, and shows the count of open roles. |
| **Register (chat bot)** | Asks the questions one at a time, chat-style (name → email → phone → student or experienced → ... → skills → location → resume link → consent). Shows a summary to confirm before saving. |
| **Verify email** | The candidate clicks a link from their inbox to confirm their email. |
| **My matches** | Shows the candidate's matched jobs with skills matched, the "Apply" link and the last date. Reached through a secure personal link sent by email, so there is no password to remember. |
| **Update my profile** | Same secure link; lets the candidate change skills or preferences, which triggers re-matching. |
| **Job listings** | A public list of open roles from verified companies, with filters (internship/job, location, remote). |
| **Job detail** | One job's full details plus a "Verified company" badge. |
| **Unsubscribe** | Stops emails with one click. |
| **Privacy policy & Terms** | Legally needed because you store personal data. |
| **Contact / About** | Basic info. |

### 3.2 Admin pages (login required, only you)

| Page | What it does |
|---|---|
| **Admin login** | Email + password. |
| **Dashboard** | Today's numbers: new candidates, open jobs, companies waiting for verification, emails sent today vs. the daily limit. |
| **Companies list** | All companies, filtered by pending/verified/rejected. |
| **Add company** | Enter the name + website (+ CIN if you have it), then click **"Research with Claude"**. |
| **Company verification scorecard** | Shows Claude's filled scorecard, score, sources, red flags and summary. You can edit any field, add notes, and click **Approve** or **Reject**. |
| **Jobs list** | All jobs with status, posted date, last date and number of matches. |
| **Post new job** | A form to add a job. The company dropdown only allows verified companies to be set to "open". Includes a **"Duplicate yesterday's job"** shortcut for fast daily posting. |
| **Edit job** | Change or close a job. |
| **Candidates list** | Search and filter candidates (skills, type, graduation year, location). Export to CSV. |
| **Candidate detail** | A full profile plus their matches. |
| **Matches & emails** | See which matches were emailed, failed or clicked. Has a "Run matching now" button. |
| **Skills list** | Manage skill names and alternative spellings. |
| **Settings** | Matching threshold, email sender name, daily email limit. |

---

## 4. Company verification scorecard

### 4.1 How it works

1. You add a company (name + website, plus CIN if known).
2. Claude searches the web (the official company registry/MCA data sites, the company website, LinkedIn, funding news sites such as Tracxn/Crunchbase/Inc42/YourStory, and news articles).
3. Claude fills every field **and gives a source link for each fact**. If it can't find something, it writes **"Not found"** and gives 0 points. **It must never guess.**
4. The system adds up the points (the points are calculated by the website using fixed rules, *not* by Claude's opinion, so scoring stays consistent).
5. **You** review the scorecard and click Approve or Reject. Nothing goes live without your click.

### 4.2 Points (total 100)

| # | Check | Max points | How points are given |
|---|---|---|---|
| 1 | **Legal registration** | **25** | CIN/registration found **and** the name matches (15). Registry status "Active" (10). Struck off/dissolved = automatic **red flag**. |
| 2 | **Online presence** | **15** | Working website on its own domain (5). LinkedIn page exists and matches (5). HR/contact email is on the company domain, not Gmail/Yahoo (5). |
| 3 | **Employee strength** | **10** | 200+ = 10 · 51–200 = 8 · 11–50 = 6 · 1–10 = 3 · not found = 0. Bonus check: LinkedIn headcount roughly agrees with the claimed size. |
| 4 | **Location** | **10** | Address found and matches across 2+ sources (10). Only 1 source (5). Not found (0). |
| 5 | **Company age** | **10** | 5+ years = 10 · 2–5 years = 7 · under 2 years = 4 · not found = 0. |
| 6 | **Funding** | **20** | Funded, confirmed by a reliable source (8). Latest round within the last 24 months (4). Known/institutional investors named (4). Total funding amount confirmed (4). **Not funded is not punished:** a bootstrapped company can earn up to 12 of these 20 points by showing real customers/revenue (e.g., client list, revenue reported in filings). |
| 7 | **Recent achievements / news** | **10** | 2+ positive, credible news items or awards in the last 12 months (10). 1 item (5). None (0). Negative news (fraud, unpaid stipends, layoffs scandal) = **red flag**. |
| | **Total** | **100** | |

### 4.3 What the score means

| Score | Colour | Recommendation |
|---|---|---|
| **75–100** | 🟢 Green | Likely genuine, so **recommend approve**. |
| **50–74** | 🟡 Amber | **Review carefully**: check the missing items yourself. |
| **0–49** | 🔴 Red | **Recommend reject** unless you personally know the company. |

### 4.4 Red flags (any one puts the company "On hold", whatever the score)

- Registry says struck off, dissolved or under liquidation.
- The company name doesn't match the CIN.
- Reports of asking candidates for **money / "registration fees" / "training fees"**.
- Reports of unpaid stipends or fake internships.
- Website created very recently and no other sources found.
- Contact details are only personal Gmail/WhatsApp numbers.

### 4.5 Re-verification

Verified companies are flagged for a fresh check every **6 months**, or straight away if a candidate reports a problem.

---

## 5. Matching rules (simple version)

A job is matched to a candidate when **all** of these are true:
1. The company is **verified** and the job is **open**, and the last date hasn't passed.
2. Type fits (internship / job / both).
3. Location fits (same city, or the job is remote, or the candidate chose "Any").
4. Experience fits (if the job lists min/max years).
5. **Skill match ≥ 50%**: at least half of the job's required skills are in the candidate's skills (after fixing spellings using the Skills list).

**Match score** = (required skills matched ÷ total required skills) × 100, plus a small bonus for nice-to-have skills. Best matches are shown first.

**When matching runs:**
- Right after a candidate registers or updates their profile, so they see matches immediately.
- Right after you post a new job, so all fitting candidates get matched.
- **Emails:** one daily digest email per candidate with their new matches (not one email per job), to stay within the free email limit and avoid annoying people.

---

## 6. Build steps (in order, each small enough to test on its own)

Each step ends with **"✅ Test"**: what you should see before moving on.

### Phase A: Foundation
1. **Clean up the repository.** Fix the nested folders, finish the incomplete `server.py`, and trim `requirements.txt` to only what we need (remove the Emergent-only package).
   ✅ Test: the server starts on a computer and `/docs` opens in the browser.
2. **Create a free MongoDB Atlas database** and connect it.
   ✅ Test: a "health check" page says "Database: connected".
3. **Deploy the empty backend to Render.**
   ✅ Test: the Render web address shows the `/docs` page online.

### Phase B: Candidates
4. **Candidate table + "save candidate" and "view candidate" features** (backend only).
   ✅ Test: on `/docs`, add a test candidate and read it back. A duplicate email is refused.
5. **Skills list with alternative spellings.**
   ✅ Test: saving "reactjs" is stored as "React".
6. **Create the React frontend and deploy it to Vercel** with just a Home page.
   ✅ Test: the Home page opens at the Vercel web address.
7. **Chat-style registration bot (questions only, no saving yet).**
   ✅ Test: you can answer every question; experienced-only questions are skipped for students; wrong email or phone formats are caught.
8. **Connect the bot to the backend** so answers are saved, with a summary to confirm first.
   ✅ Test: after registering on the website, the candidate appears in the database.
9. **Save half-finished chats** (chat sessions).
   ✅ Test: close the tab halfway, reopen it, and the bot continues where you left off.

### Phase C: Admin basics
10. **Admin login.**
    ✅ Test: a wrong password is refused; the right one opens the dashboard; admin pages can't be opened without logging in.
11. **Companies: add / list / edit (manual, no Claude yet).** Status starts as "pending".
    ✅ Test: add a company by hand and see it in the list as Pending.
12. **Jobs: post / list / edit / close.** A job can't be "open" unless its company is verified.
    ✅ Test: posting an open job for a pending company is blocked; it works once the company is approved.

### Phase D: Company verification
13. **Scorecard page with manual entry + automatic point calculation** (still no Claude).
    ✅ Test: type in sample facts, the score and colour update correctly, and Approve/Reject changes the status and verified date.
14. **"Research with Claude" button.** Claude searches the web and fills the scorecard with source links. *(Needs a Claude API key, the first paid item.)*
    ✅ Test: research 3 real companies you know well (one big, one small startup, one fake/unknown) and check that the scores make sense and every fact has a source.
15. **Red flag detection + "On hold" rule.**
    ✅ Test: a company with a struck-off status shows On hold even if its other points are high.

### Phase E: Matching
16. **Matching engine (backend only).**
    ✅ Test: with 3 test candidates and 3 test jobs, the right pairs match and the scores are as expected.
17. **Auto-match on new candidate and on new job.** Never duplicate a match.
    ✅ Test: register a candidate and matches appear; post a job and new matches appear for fitting candidates.
18. **"My matches" page for candidates** (secure personal link).
    ✅ Test: open the link and see the matched jobs with apply links; someone else's link shows only their own matches.
19. **Public job listings + job detail pages.**
    ✅ Test: only open jobs from verified companies are listed.

### Phase F: Email
20. **Connect Brevo and send a test email.**
    ✅ Test: an email arrives in your inbox (and not in spam; this needs the sender domain set up).
21. **Email verification for candidates + unsubscribe link.**
    ✅ Test: register, click the link in the email, and the profile shows "verified"; unsubscribe stops further emails.
22. **Daily match digest email** (scheduled with GitHub Actions) + email log.
    ✅ Test: run it by hand once; each candidate gets one email listing only new matches; the log shows the results.

### Phase G: Polish & launch
23. **Auto-close jobs after the last date** (same daily schedule).
    ✅ Test: a job with yesterday's last date becomes "closed" after the daily run.
24. **Admin dashboard numbers, candidate search, CSV export.**
    ✅ Test: the numbers match what's in the database; the export opens in Excel.
25. **Privacy policy, terms, consent checkbox in the bot.**
    ✅ Test: registration can't finish without consent.
26. **Final check & launch:** test on a phone, back up the database, and register yourself as the first real user.
    ✅ Test: full journey works: register → company verified → job posted → match shown → email received.

### Later (nice to have, not now)
- Resume file upload, with skills read automatically from the resume.
- WhatsApp notifications.
- Candidate "applied / not interested" feedback buttons.
- Companies posting their own jobs (with your approval).

---

## 7. Things you'll need to sign up for (all free except Claude)

| Service | Used for | Cost |
|---|---|---|
| GitHub | Code storage | Free |
| MongoDB Atlas | Database | Free (M0) |
| Render | Backend hosting | Free |
| Vercel | Frontend hosting | Free |
| Brevo | Emails | Free (300/day) |
| A domain name (optional but recommended) | A professional web address, and stops emails landing in spam | ~₹800–1,000/year |
| Anthropic (Claude API) | Company research | Pay per use |
