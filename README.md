# Coffee Meets Codex

A friendship and romance prototype for Codex users, made for Taipei Hack Day on October 4, 2026. Shared curiosity starts the conversation; each person chooses what comes next. Independent project, with no OpenAI or Coffee Meets Bagel affiliation.

## Explore the demo

- [Public showcase](https://andydrewie.github.io/coffee-meets-codex/) — a static presentation of the existing demo, with fictional adult profiles and approved artwork.
- [Open the real app](https://coffee-meets-codex.andydrewie.chatgpt.site/app) — ChatGPT sign-in remains required for the app and its account-specific actions.
- [Public demo film](https://www.youtube.com/watch?v=maVYbw1YPMk) · [original Drive copy](https://drive.google.com/file/d/1aVVIqIKvbZTJDMnnL31b3ijU746ZX-_Q/view?usp=drivesdk).

The showcase does not create profiles, save interests, call a model, contact people, or enroll visitors in discovery. It hands off to the real app for sign-in. Friend and Lover remain separate choices. All sample people and projects are fictional; no real public profiles are published.

## Two deployment targets

| Target | Source | Runtime |
| --- | --- | --- |
| GitHub Pages showcase | `showcase/` → `docs/` | Static HTML, CSS, JavaScript and approved demo images |
| Sites app | `app/`, `lib/`, `db/`, `drizzle/` | React 19 / Vinext, Cloudflare Worker, D1 and Sites-managed ChatGPT identity |

GitHub Pages serves only `docs/` from `main`. It cannot run the app's backend or authenticate users. Source publication does not deploy or migrate the live Sites app, change its access policy, or enroll anyone into discovery.

The app snapshot was compared with Sites v6 checkpoint `ecb76659099c9ba54da6c3864173c9bc20233dcb`. The sync includes its fictional Mika/Noah portraits and Tina/Owen companion variants, with the existing cream, coral and sage identity. The auth helpers, API routes and fictional demo records remain unchanged. Environment-specific hosting configuration and runtime databases are excluded.

## Build the static showcase

These commands use Node.js built-ins and require no dependency install:

```sh
npm run build:showcase
npm run check:showcase
python3 -m http.server 4173 --directory docs
```

Open `http://localhost:4173/` for a quick preview. Before publishing, also serve the built directory at `/coffee-meets-codex/` and check desktop/mobile layouts, keyboard interaction and the real app handoff. The offline checker validates every local asset reference against that repository subpath, checks the static output allowlist, and rejects runtime API calls. It is not a replacement for browser verification.

Edit `showcase/`, then rebuild and commit the generated `docs/` target. The builder copies only three static source files, the favicon, seven approved demo assets and `.nojekyll`; it refuses unexpected existing output files. No workflow, credentials, model key or backend configuration is required by this target.

## Develop the full-stack app

```sh
cp .openai/hosting.example.json .openai/hosting.json
npm ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_chief_omega_flight.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_jittery_prima.sql
npm run dev
```

Portable development has an explicitly local sign-in fixture, absent from production output. Hosted identity is provided by Sites. Local fixture tests are not evidence of independent real-account approval.

```sh
npx tsc --noEmit
npm run build
npm start -- --port 8787
python3 scripts/test-api.py
```

The API checks write synthetic records to a disposable loopback database. Never point them at production. They cover authentication rejection, isolation, profile persistence, Friend/Lover eligibility, consent, withdrawal and blocking.

The app source supports a bounded OpenAI Responses scout only when its Sites environment has an authorized `OPENAI_API_KEY`; publishing this repository does not configure or verify live inference. Scripted previews remain labeled. Sign-in does not verify age or public-handle ownership, import private chats, or fund API use. Profile links and optional activity evidence are owner supplied; usage is never a compatibility or wealth score. No automatic scraping, contact release or external messaging is implemented.
