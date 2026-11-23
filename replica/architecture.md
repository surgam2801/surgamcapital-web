# Architecture: Surgam Mutual Funds (Phase 1)

Keeps the stack the project already has.

| layer | choice | why |
| --- | --- | --- |
| web + mobile | Expo Router (React Native + react-native-web) | one codebase for web/desktop and Android/iOS, already in place |
| API | Express + tRPC 11 (`server/`) | already in place, end-to-end types |
| database | MySQL via Drizzle (`drizzle/schema.ts`) when `DATABASE_URL` is set; local JSON store otherwise | lets the app run on a laptop with no DB server |
| market data | AMFI daily NAV file (public) for scheme master + latest NAV; public NAV history by AMFI code for charts and returns | free, official, no partner contract needed |
| auth | phone + OTP, JWT bearer token (`jose`) | no third-party login dependency; dev mode shows the OTP on screen |
| orders | stored with status `PENDING_PAYMENT` → simulated `ALLOTTED` | real exchange (BSE StAR MF / NSE NMF) plugs in later behind the same function |

## API (tRPC, `mf.*`)

- `mf.status` – data source health, last refresh
- `mf.categories` – categories with scheme counts
- `mf.search({ q, category, amc, limit })`
- `mf.scheme({ code })` – latest NAV + facts
- `mf.history({ code, range })` – NAV series
- `mf.returns({ codes })` – 1M/6M/1Y/3Y/5Y returns
- `mf.performance({ category, sort })`
- `mf.topList({ list })`
- `mf.industry()` / `mf.debt()`
- `mf.nfos()`
- `auth.requestOtp({ phone })`, `auth.verifyOtp({ phone, otp })`, `auth.investor()`
- `orders.place(...)`, `orders.list()`, `sips.create(...)`, `sips.list()`, `goals.*`

Calculators and tax-harvest maths live in `shared/mf/calc.ts`, shared by server and client.

## Build order

1. Tokens + site shell (header, nav, footer)
2. Home, About, MF landing (static content, Surgam copy)
3. Data layer: AMFI import → search/scheme/history → fund detail
4. Invest loop: sign in → order → dashboard
5. Explore tools and calculators
6. Verify on web (desktop/phone widths), rebuild APK
