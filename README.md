# 1-Altitude Reboot — Multi-Agent Strategic Ideation Tool

A Next.js app that orchestrates **12 Claude API agents** in three sequential waves to re-imagine the return of 1-Altitude to One Raffles Place (Levels 61–63). Built for 1-Group Singapore. The agents reason in the open, the workflow streams progress live, and the final synthesis includes a ≤350-word tease document for Brian Riady (OUE Deputy CEO).

This is a thinking tool, not a deck. Output is generated on each run.

---

## What it does

When you hit **Run the agents**, the app executes this workflow:

```
WAVE 1 (parallel) ─── builds context
  ├─ The Historian              audience memory of 1-Altitude 1.0
  ├─ The Site Sensor            physical truth of Levels 61–63
  ├─ The Competitive Cartographer   live 2026 competitive map (uses web_search)
  └─ The Cultural Scout         2026 Singapore cultural currents
              │
              ▼
WAVE 2 (parallel, reads Wave 1) ─── divergent ideation
  ├─ The Vision Architect       public + commercial vision
  ├─ The Mission Designer       operationally testable mission
  ├─ The Concept Inventor       6 NEW concept directions
  ├─ The Wedding Strategist     wedding offer with bridal suite + 1-Host integration
  ├─ The Members' Layer Designer    private layer (NOT Soho House thinking)
  └─ The Discovery Strategist   AI-mediated discovery plan (uses web_search)
              │
              ▼
WAVE 3 (sequential) ─── audit and synthesis
  ├─ The Differentiation Auditor   kill-tests each concept
  └─ The Synthesiser            final unified narrative + Brian Riady one-pager
```

Hard rules enforced in every agent prompt:
- **Stellar and Altimate are excluded** from all output
- The brief's three concepts (Return / Sky Quarter / Society in the Sky) are foils only — agents must transcend them
- Banned generic-rooftop language list ("elevated experience", "iconic skyline", "world-class", etc.)
- Singapore-rooted reasoning, no London/NYC template imports

---

## Prerequisites

- **Node.js 18.17+** (Next.js 14 requirement)
- **An Anthropic API key** with access to `claude-sonnet-4-20250514` and the `web_search_20250305` tool. Get one at [console.anthropic.com](https://console.anthropic.com/settings/keys).

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.example .env.local
# then edit .env.local and add your real key

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

A full workflow run takes **~3–5 minutes** and consumes **~36 API calls** (12 agents × 3 passes per agent — though we're using single-call agents in this build for speed; the prompts handle internal multi-pass reasoning).

---

## Deploy to Vercel via GitHub

### One-time setup

1. **Create a GitHub repo:**
   ```bash
   cd 1-altitude-reboot
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create 1-altitude-reboot --private --source=. --push
   # or use the GitHub website to create the repo and push manually
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repo
   - Framework preset: **Next.js** (auto-detected)
   - Build command: `next build` (default)
   - Output directory: `.next` (default)

3. **Add the environment variable:**
   - In the Vercel import flow (or later in Project Settings → Environment Variables), add:
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** your `sk-ant-api03-…` key
     - **Environments:** Production, Preview, Development (all checked)

4. **Deploy.** Vercel handles the rest. The first deploy takes ~2 minutes.

### Subsequent deploys

```bash
git push origin main
```
Vercel auto-deploys on every push.

### Region

`vercel.json` requests **Singapore (sin1)** as the deployment region — closest to Anthropic's API edge for Asia-Pacific users.

---

## Architecture

```
1-altitude-reboot/
├── app/
│   ├── layout.jsx          Root layout with Fraunces + Manrope + JetBrains Mono fonts
│   ├── page.jsx            Main UI orchestration
│   ├── globals.css         Cinematic dark theme + atmospheric backdrop
│   └── api/agent/route.js  Server-side Anthropic API proxy (keeps key secure)
├── components/
│   ├── Hero.jsx            Editorial landing card
│   ├── InputsPanel.jsx     Briefing parameters (ambition, audience, weights, brief)
│   ├── AgentGrid.jsx       3-wave visualisation
│   ├── AgentCard.jsx       Individual agent with state badge + re-run nudge
│   ├── OutputsView.jsx     Final synthesis editorial layout + Brian Riady mode
│   └── ComparativePane.jsx Pin two of the 6 concepts side-by-side
├── lib/
│   ├── agents.js           12 agent system prompts + dependency graph
│   ├── workflow.js         3-wave orchestration with parallel/sequential logic
│   └── parseJSON.js        Defensive JSON parsing for agent responses
├── public/                  (empty — no static assets needed)
├── package.json
├── tailwind.config.js       Custom palette (midnight, champagne, platinum) + animations
├── next.config.mjs
├── vercel.json              SIN1 region, 60s function timeout
├── .env.example
└── README.md                this file
```

### Why a server-side API route?

The `/api/agent` route runs on Vercel's serverless infra and holds the API key in a server-only env var. The browser never sees the key. Each user click triggers a server function call, the function calls Anthropic, and returns the parsed JSON to the client.

### Function timeout

Some agents (especially the Competitive Cartographer with web_search) can take 30–45 seconds. `vercel.json` sets `maxDuration: 60` for the agent route. If you find yourself hitting the limit on Vercel's free tier (which caps at 10s for Hobby), upgrade to Pro (60s).

---

## Customisation

### Adjust agent system prompts
Edit `lib/agents.js`. Each agent's `systemPrompt` field is a plain string — re-deploy to apply.

### Change the model
In `app/api/agent/route.js`, modify the `MODEL` constant. Anthropic's model IDs change periodically — check the docs.

### Add a new agent
1. Add the agent definition to `AGENTS` in `lib/agents.js` with the right `wave` and `upstream` array.
2. Re-deploy. The grid auto-renders new agents in the right wave.

---

## Cost rough-cut

A single full workflow run = ~12 agents × 1 call = 12 API calls.
At Sonnet 4 pricing (~$3/MTok input, $15/MTok output) and ~5K tokens per call (most of which is upstream context being passed in):
- Input: ~60K tokens × $3/M = **~$0.18**
- Output: ~12K tokens × $15/M = **~$0.18**
- **~$0.36 per full run**, plus web_search tool fees on the 2 search-enabled agents.

Web_search tool is billed per search — check Anthropic's current pricing.

---

## Known constraints

- **No state persists between sessions** by design. Each visit starts fresh.
- **Mobile**: optimised for desktop first. Mobile works but the agent grid is dense.
- **Concurrent users** all share the same API key on the same Vercel project — if you expect multiple simultaneous runs, monitor your rate limits.
- **The `web_search_20250305` tool** must be enabled on your Anthropic account. Most accounts have it by default; check the [API docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/web-search-tool) if you get tool errors.

---

## Built by

Chris Millar · 1-Group Singapore · May 2026
Multi-agent skill spec authored in `/mnt/skills/user/1-altitude-reboot/`. This app implements that skill as a deployable tool.
