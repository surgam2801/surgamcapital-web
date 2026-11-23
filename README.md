# Surgam Capital Web

Web and desktop app for Surgam Capital (Expo Router + react-native-web).

## Pages

- `/` Home, `/about` (placeholder)
- Products: `/mutual-funds`, `/mutual-funds/[way]` (SIP, ELSS, combos, instant access, gold), `/mutual-funds/top/[list]`, `/funds/[code]`
- Explore: `/explore/*` (performance, NFOs, return/industry/debt analyzers, goal planning, tax harvesting), `/calculators/*`
- `/sign-in` (phone + OTP), `/dashboard/*` (orders, SIPs, plans), `/faqs`

## Running locally

The app talks to the API in `surgamcapital-api` (port 3000). On `localhost:8081` it finds the API at
`localhost:3000` automatically; elsewhere set `EXPO_PUBLIC_API_BASE_URL`.

```bash
# 1. API (sibling folder)
cd ../surgamcapital-api && pnpm install && pnpm dev

# 2. Web
pnpm install
pnpm dev          # http://localhost:8081
```

`lib/trpc.ts` imports the API's router type. For type checks, keep `surgamcapital-api` checked out
next to this folder (`tsconfig.json` maps `@/server/*` to `../surgamcapital-api/server/*`).
It is a type-only import, so the web bundle does not include server code.

`shared/mf/` (fund maths, copy, types) is shared with the API; keep both copies in sync.

## Build

```bash
pnpm build        # static SPA in dist/, deploy with the existing vercel.json / netlify.toml rewrites
```
