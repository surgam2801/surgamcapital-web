# Recon map: Mutual Fund investing site (Surgam rebuild)

Clean-room reference. Source: the public landing pages of the reference platform, read in a browser on 2026-11-23.
Only layout patterns and flows are recorded here. No copy, code, assets, API endpoints, contact details or
company information from the reference is used in Surgam.

## Scope (agreed with Anshul, 2026-11-23)

- Platform: web/desktop (Expo web) and mobile (Expo Android/iOS) from one codebase.
- Slice: Mutual Funds only. Excluded: broking, insurance, loans, LAS, P2P, smallcase, FD, bonds, NPS, AI assistant.
- Home is about Surgam. About Us is a placeholder.

## Screen inventory

| id | screen | purpose | Surgam route |
| --- | --- | --- | --- |
| S01 | Home | brand hero, ways to invest, top fund lists, numbers strip, goal calculators teaser, insights, app CTA | `/` |
| S02 | About Us | placeholder | `/about` |
| S03 | Mutual Funds landing | hero, ways to invest, top lists, "what we offer" grid, calculators teaser | `/mutual-funds` |
| S04 | Way to invest detail | SIP, ELSS, Smart Combos, Asset Allocation Combos, Instant redemption funds, Gold accumulation | `/mutual-funds/[way]` |
| S05 | Top fund list | top equity, shortlisted, alternatives to bank FD | `/mutual-funds/top/[list]` |
| S06 | Fund detail | NAV, returns, NAV chart, scheme facts, invest CTA | `/funds/[code]` |
| S07 | Invest sheet | lumpsum or SIP amount, date, confirm | modal on S06 |
| S08 | Sign in | phone number + OTP | `/sign-in` |
| S09 | Explore hub | list of research tools | `/explore` |
| S10 | Fund performance | category filter, sortable returns table | `/explore/performance` |
| S11 | New fund offers | open/upcoming NFOs | `/explore/nfo` |
| S12 | Return analyzer | pick fund + period, see CAGR / absolute / SIP return | `/explore/return-analyzer` |
| S13 | Industry analyzer | category and AMC breadth | `/explore/industry-analyzer` |
| S14 | Debt fund analyzer | debt categories compared | `/explore/debt-analyzer` |
| S15 | Goal planning | list goals, required SIP per goal | `/explore/goal-planning` |
| S16 | Tax harvesting | LTCG harvest suggestion | `/explore/tax-harvesting` |
| S17 | Calculators hub + 7 calculators | child education, child marriage, retirement, SIP wealth, SIP step-up, dream vacation, dream house | `/calculators`, `/calculators/[type]` |
| S18 | FAQs | MF basics | `/faqs` |
| S19 | Dashboard (existing) | portfolio, orders, plans, help | `/dashboard/*` |

## Core loop

Browse (S01/S03/S05/S10) → fund detail (S06) → invest sheet (S07) → sign in if needed (S08) → order placed →
shows in dashboard (S19).

## Inferred data model

AMC, scheme (AMFI code, ISIN, category, sub-category, plan, option), NAV history, investor, order
(lumpsum/SIP, amount, status), SIP plan (day, amount, step-up), goal, NFO.
