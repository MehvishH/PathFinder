# PathFinder

PathFinder helps students and career-changers work out their next step and how to pay for it. People take a short quiz, get a personalized plan from Claude, and can keep going with an AI career coach.

## What's on the site

| Page | What it does |
| --- | --- |
| `/` | Homepage |
| `/quiz` | Lets you pick between the three career quizzes |
| `/quiz/[flow]` | One question per screen for `student`, `reentry`, `switch` or `scholarships` |
| `/results/[flow]` | Shows the AI's plan for that quiz. Results are kept in `sessionStorage`, so they survive a refresh but not closing the tab |
| `/coach` | AI Career Coach chat. Sends any saved results as context |
| `POST /api/recommend` | Takes `{ flow, responses }` and returns `{ result }` (JSON matching the flow's schema) |
| `POST /api/chat` | Takes `{ messages, context? }` and returns `{ reply }` |

The four flows:

- **Find my major** (`student`): majors with match scores, career paths and timelines, schools, scholarships
- **Return to work** (`reentry`): skill gaps, certifications, target roles, a phased plan, resume tips
- **Switch careers** (`switch`): transferable skills, gaps, a path, roles, certifications
- **Find scholarships** (`scholarships`): 6 to 10 real scholarships with eligibility, deadlines and how to apply

Every page that shows AI-generated scholarships tells people to confirm amounts and deadlines on the provider's site.

## Running it locally

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Used by the API routes on the server only. Without it the pages still load, but quizzes and the coach return an error. |

On Vercel, add it under Project → Settings → Environment Variables for Production and Preview.

## How it's built

- Next.js (App Router, TypeScript, Cache Components) and Tailwind CSS
- `@anthropic-ai/sdk` with model `claude-opus-4-7`, adaptive thinking and prompt caching on the system prompts
- Prompts and JSON schemas live in `src/lib/prompts.ts`; quiz questions in `src/lib/flows.ts`
- `vercel.json` sets the framework to Next.js. Recommendations can take a minute, so `/api/recommend` allows up to 300 seconds and `/api/chat` up to 120

```
src/
  app/            pages and API routes
  components/     header, footer, trail map, quiz, results, coach
  lib/            flows, prompts, Anthropic client, storage, API client
mobile/           the original Expo app
```

## Mobile app

The original Expo (React Native) app and its Express backend now live in [`mobile/`](mobile/). See [`mobile/README.md`](mobile/README.md) to run it. It has its own `package.json` and isn't part of the website build.
