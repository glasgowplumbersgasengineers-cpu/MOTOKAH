# Motokah Feature Inventory

Generated 2026-11-12 by reading `src/App.tsx` route table directly (not guessed). 41 top-level routes + 10 nested `/admin/*` routes = 51 routes total.

## Public routes (no auth required)

| Route | Component | Notes |
|---|---|---|
| `/welcome` | Welcome | Onboarding / location picker |
| `/` | Index | Homepage — featured listings, categories, fuel prices |
| `/listing/:id` | ListingDetail | Single car listing, gallery, contact seller |
| `/search` | SearchResults | Filterable search, SEO-gated robots meta |
| `/cars`, `/listings` | → redirect to `/search` | |
| `/auth` | Auth | Sign in / sign up (email/password only — social login removed) |
| `/reset-password` | ResetPassword | |
| `/post-ad` | → redirect to `/sell` | |
| `/compare` | Compare | Side-by-side listing comparison |
| `/about`, `/contact`, `/faq`, `/how-it-works`, `/safety`, `/careers`, `/terms`, `/privacy`, `/stationery` | Static content pages | |
| `/blog`, `/blog/:slug` | Blog | |
| `/dealers` | DealerDirectory | |
| `/dealer/:id` | DealerProfilePage | Public dealer showroom |
| `/city/:slug`, `/country/:slug`, `/country/:country/:make`, `/cars/:make/:model/in/:city`, `/cars/:make/in/:city`, `/cars/:make/:model` | Programmatic SEO landing pages | Gated by `pageListingCounts.ts` thresholds (noindex under 3 real listings) |
| `/showroom/:username` | InstagramShowroom | Scraped-dealer public showroom |
| `/promo` | PromoVideo | |
| `/brand-centre` | BrandCentre | |
| `/buy-car-for-family-in-east-africa` | DiasporaLandingPage | |
| `/duty-calculator` | DutyCalculator | |
| `/marketing-plan`, `/dealer-leads` | → redirects | |
| `*` | NotFound | |

## Protected routes (`<ProtectedRoute>` — requires auth)

| Route | Component | Notes |
|---|---|---|
| `/sell` | SellCar | Post-ad form — **image upload, multi-field form, not yet E2E tested** |
| `/profile` | Profile | **Not yet E2E tested** |
| `/wishlist` | Wishlist | **Not yet E2E tested** |
| `/messages` | Messages | **Bug fixed this session**: silent send failure, no keyboard-resize config, no optimistic append. See BUG_REGISTER.md |
| `/become-dealer` | BecomeDealer | **Not yet E2E tested** |
| `/dealer-dashboard` | DealerDashboard | **Not yet E2E tested** |
| `/content` | AdminContent (wrapped) | Oddly also reachable outside `/admin` behind plain ProtectedRoute, not role-gated — **flag for review, possible access-control gap** |

## Admin routes (`/admin/*` — nested under `AdminLayout`, presumably role-gated inside `AdminLayout` itself, not inspected this pass)

`index` (AdminOverview), `analytics`, `listings`, `users`, `reports`, `blog`, `contacts`, `newsletter`, `dealers`, `content`.

**Not yet verified**: whether `AdminLayout` actually enforces `isAdmin` server-side (RLS) or only client-side route guard — client-only guard would be a real security gap. Needs a follow-up RLS check on whichever tables admin pages write to.

## Native/Capacitor-specific surface

- `@capacitor/app`, `@capacitor/browser`, `@capacitor/keyboard` (added this session), `@capacitor/splash-screen`, `@capacitor/status-bar`.
- No `@capacitor/camera`, `@capacitor/push-notifications`, or `@capacitor/filesystem` — **confirmed** by reading `SellCar.tsx:443,469,503`: image/video upload uses plain web `<input type="file">`, not a native camera plugin. Android's built-in WebView file-chooser handles this; no extra native permission needed for it.
- `android/app/src/main/AndroidManifest.xml`: only `INTERNET`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` permissions declared. Consistent with the above — no gap found here.

## Known blockers for deeper automated coverage

- No credentials available anywhere in repo/vault for the existing `motokahqa1` seeded test account — blocks any CI test of authenticated routes (Sell, Profile, Wishlist, Messages, Become Dealer, Dealer Dashboard, Admin) until Owner provides the password or approves creating a fresh seeded account.
- No macOS/Android real-device farm connected; native UI automation (Appium/Maestro) not yet installed — see GITHUB_TOOL_RESEARCH.md for what's planned vs. what's actually running.
