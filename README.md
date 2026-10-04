# Coffee Meets Codex

An opt-in adult connection prototype built for Taipei Hack Day, October 4, 2026. Friend and Lover share a consent-first engine and a responsive personal-newspaper bento.

## What works
- Genuine Sites dispatch-owned Sign in with ChatGPT
- D1-backed owner profiles, private settings, saved briefs, interests and blocks
- Five-step owner setup with a self-attested public profile link, optional self-described gender and public Mystery visibility
- Owner-selected project, social and optional usage evidence with display/scout-use controls
- Three clearly fictional adult demo connection cards per intention
- Full bento, evidence sheet, two reasons, an uncertainty and a suggested opener
- Persisted Pending, independent live participant approval endpoints, withdrawal and blocking
- Explicitly labeled synthetic second-approval preview; no contact release or external messaging

## Important limits
Live AI scouting is **not configured**. Demo scouting is scripted and is labeled in the UI and API. Sign-in does not supply API funding, verify age or public-handle ownership, or import private chats. Owner-provided links and metrics are unverified. No automatic scraping or metric ingestion exists. Usage evidence is not a compatibility/wealth score.

No real person is automatically enrolled. Demo-only mode is the default. Andrew's real portfolio is not seeded into either discovery pool. Switching to real discovery requires explicit owner opt-in. Friend does not automatically become Lover. Public launch is not authorized by this source deliverable.

## Stack
React 19 + Vinext, Cloudflare Worker-compatible ESM, D1 with schema-only Drizzle migrations. Sites owns hosting, authentication, database bindings and sharing. The Worker entrypoint is `dist/server/index.js`; `.openai/hosting.json` declares logical DB binding.

## Local development
```
cp .openai/hosting.example.json .openai/hosting.json
npm ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_chief_omega_flight.sql
npm run dev
```
Portable development has an explicitly local sign-in fixture; this is absent from production output. Do not mistake local identity-header tests for real two-account consent testing. If the runtime home is read-only, use writable `npm_config_cache` and `XDG_CONFIG_HOME` paths for those tools.

## Checks
```
npx tsc --noEmit
npm run build
npm start -- --port 8787
python scripts/test-api.py
```
The API test script targets only loopback and uses local synthetic account headers. It writes local test records, including profile-shaped validation fixtures. Run on a disposable local DB. Never point it at production. It covers 24 cases: auth rejection, save/reload, isolation, Friend/Lover filtering, honest runtime labels, idempotency, independent consent, withdrawal, block privacy and reciprocal preferences.

## Structure
- `app/app/coffee-app.tsx`: four screen families and source/interest dialogs
- `app/api/[...path]/route.ts`: app API and consent state machine
- `lib/server.ts`: validation, projections and eligibility
- `lib/demo.ts`: unmistakably fictional adult fixtures
- `db/schema.ts`, `drizzle/`: durable storage schema and migration
- `public/assets/`: supplied Owen/Tracy portraits and generated fictional-project gallery

## Delivery
This public repository contains the source prepared for judging. The deployed Site has separate access controls; publishing source does not change Site sharing. Project-specific hosting configuration and runtime databases are intentionally excluded. Copy `.openai/hosting.example.json` to `.openai/hosting.json` for portable local development.
