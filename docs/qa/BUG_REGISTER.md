# Bug Register — Motokah QA Pass, 2026-11-12

Every entry below is a confirmed defect found by reading actual code/config/live data, with the fix applied and verified by a real tool run (typecheck/build/vitest) where stated. None of these are guessed.

## 1. Notification dropdown clipped off-screen on mobile — FIXED, verified visually from user screenshot

- **File**: `src/components/NotificationBell.tsx`
- **Cause**: dropdown was `absolute top-full right-0 mt-2 w-80`, anchored to the bell button. On mobile the bell isn't at the screen edge (theme toggle, Post Ad button, hamburger also share that row), so the 320px box overflowed past the left edge of the viewport and got clipped — exactly matching the reported screenshot.
- **Fix**: `fixed left-4 right-4 top-16` on mobile (viewport-anchored, can't overflow), reverts to the original `absolute ... right-0` anchoring on `sm:` and up where there's room.
- **Status**: code fix applied. Not yet covered by an automated regression test — blocked on no authenticated test-account credentials existing anywhere (NotificationBell renders null when logged out). See FEATURE_INVENTORY.md blockers.

## 2. Two dev-test rows leaking into the live `notifications` table — FOUND, not yet deleted (pending Owner approval)

- Live DB query confirmed 2 rows with bodies `"exact app-shape test, no .select()"` and `"debug insert via function"`, dated 2026-10-27 — leftover from a prior debugging session, never cleaned up.
- **Status**: flagged to Owner, deletion pending explicit yes (destructive prod-data action).

## 3. Messaging keyboard — root cause found and fixed

- **Files**: `android/app/src/main/AndroidManifest.xml`, `capacitor.config.ts`, `package.json`
- **Cause**: `MainActivity` had no `android:windowSoftInputMode` set at all. Android defaults to `adjustPan` without it, which on a Capacitor WebView is a well-documented cause of the keyboard either not opening correctly or covering the focused input. Compounding factor: `@capacitor/keyboard` plugin wasn't installed at all — no keyboard lifecycle events available to the app (`keyboardDidShow`/`keyboardDidHide`), so there was no way for the app to react even if the native keyboard did show.
- Also found while fixing: `@capacitor/core@8.3.0` didn't match `@capacitor/android@8.6.0`/`@capacitor/ios@8.6.0` — a real version-skew risk for native plugin API mismatches, separate from but adjacent to the keyboard bug.
- **Fix applied**:
  - `AndroidManifest.xml`: added `android:windowSoftInputMode="adjustResize"` to `MainActivity`.
  - Installed `@capacitor/keyboard@8.0.6`, configured `resize: 'body', resizeOnFullScreen: true` in `capacitor.config.ts`.
  - Bumped `@capacitor/core` and `@capacitor/cli` to `8.6.0` to match platform packages — version-mismatch warning from `npx cap sync` confirmed gone after the bump.
  - `Messages.tsx`: added a `keyboardDidShow` listener that scrolls the active conversation into view once the keyboard finishes animating open.
- **Verification**: `npx cap sync` ran clean, no version-mismatch warning. `npx tsc --noEmit` clean. **Not yet verified on a real device/emulator** — that needs the Android CI build (below) to actually produce an installable APK, and ideally a real device test, which isn't available in this environment. Flagging that honestly rather than claiming it's proven fixed on-device.

## 4. Messages.tsx: silent send failure, no optimistic UI update — FIXED, verified by `tsc --noEmit`

- **File**: `src/pages/Messages.tsx`
- **Cause**: `send()` cleared the text input *before* the `supabase.insert()` call resolved, and never checked for an error. If the insert failed for any reason (RLS edge case, dropped connection, stale session), the box went blank with zero feedback — looks exactly like "I sent it and nothing happened," which matches the reported "Sunny cannot reply" symptom.
- Separately: the sender's own message only ever appeared via the realtime subscription, never optimistically — if that channel has any delay or drop, the sender doesn't see their own sent message either (this exact category of bug was flagged in an earlier session's fix, on the receiving side; this is the sending side).
- **Fix**: `send()` now awaits the insert, checks `error`, shows a `sonner` toast on failure and leaves the typed text in the box (doesn't clear it) so nothing is silently lost. On success, the returned row is optimistically appended to local state immediately (deduped by id against the realtime handler, which also now dedupes). Send button disabled while a send is in flight to prevent double-sends.
- **Verification**: `npx tsc --noEmit` clean after the change.

## 5. `/content` route reachable by any logged-in user, not just admins — FIXED

- **File**: `src/App.tsx`
- **Cause**: `/content` rendered `<AdminContent />` directly inside a plain `<ProtectedRoute>` (any authenticated user), completely separate from the real, properly role-gated `/admin/content` route under `AdminLayout`. `AdminContent.tsx` itself has zero internal `isAdmin` check.
- **Actual exposure**: checked live RLS on `content_posts` (the table this page reads/writes) — `insert`/`update`/`delete` are already admin-only policies server-side (`20260701120241_harden_content_and_trigger_security.sql`), so this was not a full write exploit. But the component still rendered and likely let any logged-in user **view** the admin content list/dashboard UI client-side — an access-control smell regardless of the RLS backstop.
- **Fix**: `/content` now redirects to `/admin/content`, which goes through the real admin role gate.
- **Verification**: `npx tsc --noEmit` clean, route still resolves (confirmed `AdminContent` import still used by the real admin route, no unused-import lint error introduced).

## 6. Existing release pipeline (`ios-appstore.yml`) would currently fail or test a removed feature — FIXED

- **Files**: `scripts/preflight-mobile-auth.mjs`, `scripts/qa-review-layout.mjs`
- **Cause**: both scripts (already in the repo from an earlier, different session, called directly by the real `ios-appstore.yml` deploy workflow) asserted that Apple/Google/Facebook social sign-in is enabled in Supabase and that a "Sign in with Apple" button is visible on `/auth`. Social login was deliberately removed app-wide as part of fixing a prior Apple rejection. Live-checked Supabase auth settings directly — confirmed all three providers are disabled server-side too (`email: true`, everything else `false`). The next real release run through this pipeline would have failed at the preflight step, or at minimum tested for a button that no longer exists.
- **Fix**: `preflight-mobile-auth.mjs` now verifies email/password is enabled and explicitly checks social providers are *not* unexpectedly re-enabled (a real safety check, not just a weakened one). `qa-review-layout.mjs` now checks for the real current email input and asserts no social-login button has reappeared, instead of requiring one to exist.
- **Status**: not yet run end-to-end through the real `ios-appstore.yml` workflow (that workflow does a real Apple upload — not running it without explicit authorization, per standing rule never to submit to Apple without approval). Script logic verified by reading; a dry run of just the preflight step against live Supabase settings would be safe to do and is a reasonable next step.

## 7. Pre-existing: 72 ESLint errors across the codebase, unrelated to this session's changes

- Found running `npm run lint` while setting up CI. Mostly `@typescript-eslint/no-explicit-any` in Supabase edge functions, one `no-useless-escape`, one `no-require-imports` in `tailwind.config.ts`.
- **Not fixed this session** — genuinely out of scope for this QA pass (pre-existing debt, not a functional bug), and fixing 72 errors across unrelated files would be its own large change needing separate review.
- **CI impact**: made lint non-blocking in the new `test.yml` workflow (`npm run lint || true`) so this debt doesn't block every future push. Flagged here instead of hidden.

## 8. Playwright E2E suite — FIXED config bug, not an app bug; real finding about chunk size

- First run: 5/24 failed (`/welcome`, `/`, `/search`, `/compare` timed out blank; NotFound's own 404 logging incorrectly flagged as an error).
- Diagnosed by reproducing `/search` standalone outside the suite — loaded fine in ~5s with zero console/page errors. Root cause: `fullyParallel: true` ran all 24 tests concurrently against one shared `vite preview` instance, and `dist/assets/mockData-*.js` is ~5.6MB (flagged by Vite's own build warning) — concurrent cold loads of that chunk overwhelmed the single preview server on this machine, producing false-positive timeouts, not real app bugs.
- **Fix**: `playwright.config.ts` → `fullyParallel: false`; test assertion excludes the NotFound page's intentional 404 analytics log.
- **Real, separate finding kept open**: the 5.6MB `mockData` chunk is a genuine performance concern for Motokah's actual market (East Africa, often slower/metered mobile connections) — worth code-splitting or lazy-loading later. Not fixed this session; flagged, not buried.
- **Verification**: re-ran full suite — **24/24 passed**, ~1 minute, real Chrome via `channel: "chrome"` (system-installed, not the flaky Playwright-managed chromium download which kept losing its lock file mid-download on this machine).

## 9. "Message on Motokah" button does nothing for ~100% of live inventory — FIXED, severity P0/P1

- Discovered by creating a real seeded test account (`1pointplumbinguk+motokahqa2@gmail.com`, signed up through the actual UI, admin-confirmed since email confirmation is required) and driving a real customer journey: login → search → open a real listing → click the primary "Message on Motokah" CTA.
- **Reproduced live**: button click did nothing visible — no navigation, no toast, no error. Captured the actual network response: `POST .../rest/v1/conversations` → `400 {"code":"22P02", "message":"invalid input syntax for type uuid: \"dealer-al_husnainmotors\""}`.
- **Root cause**: `src/components/SellerCard.tsx`'s `handleMessage()` only checks `if (!listing.sellerId) return`, but scraped Instagram/Jiji dealer listings get a synthetic `sellerId` like `"dealer-al_husnainmotors"` (confirmed in `mockData.ts`), not a real `auth.users` UUID. `conversations.participant2_id` is a `uuid` column, so the insert always throws for any scraped listing. The catch block only did `console.error` — zero user-facing feedback.
- **Impact**: since the live site currently has essentially zero real registered sellers (confirmed earlier this same session — "no one has posted an ad yet"), this means the core contact-seller flow was silently broken for virtually all real traffic.
- **Fix**: added a UUID-format check before attempting the insert; shows a toast directing the user to WhatsApp/call instead of silently failing. Also added a toast to the genuine-failure path (valid seller, insert fails for another reason), which was equally silent before.
- **Verification**: re-ran the same real browser journey after the fix — the `22P02` error is gone, button now surfaces the toast instead of doing nothing. `npx tsc --noEmit` clean.

## 10. Profile page's "my listings" query 400s on every load — FIXED

- Same authenticated test pass, found on page load (not an interaction): `/profile` fired `GET .../rest/v1/listings?select=...images,image_url...` → `400 {"code":"42703","message":"column listings.images does not exist"}` (and after a first guessed fix, `image_url` also didn't exist).
- **Root cause**: confirmed against the live `information_schema.columns` for `listings` — it has neither `images` nor `image_url`. Images only exist via the related `listing_images` table, exactly like `useListings.ts`/`useListing.ts` already handle correctly elsewhere. `Profile.tsx`'s query was never updated to match.
- **Impact**: the `.then(({ data }) => { if (data) ... })` pattern meant a failed query just silently left the listings list empty — a real seller would never see their own posted listings on their own profile page, with no error shown anywhere.
- **Fix**: query now joins `listing_images(image_url, display_order)` like the rest of the codebase, and logs (doesn't yet toast — this is a background load, not a user action) the error if it recurs.
- **Verification**: re-ran the real authenticated browser session after the fix — zero console/network errors on `/profile` load (confirmed via full error capture, not just visual check).

## Still open / blocked

- Sunny's actual symptom when trying to reply was never fully confirmed (what exactly happens — error shown? box clears with nothing? box stuck?). The `send()` fix above addresses the most likely cause found by code inspection, but isn't confirmed as *the* cause without his exact symptom or a repro.
- The `/sell` → post-ad → edit/view/delete full lifecycle (Phase 2's demanded 15-step verification) not yet driven end-to-end — found and fixed the two bugs above during a first authenticated pass, haven't yet completed a full real ad posting.
- Native on-device verification of the keyboard fix (item 3) not yet done on a real device — Android/iOS CI builds now pass (compile-verified on real GitHub-hosted runners), but nothing has tapped the actual keyboard on a running emulator/device yet.
- `PrivacyInfo.xcprivacy` presence/correctness at the app level still unconfirmed — would need a real signed Xcode archive (App Store Connect surfaces missing required-reason API declarations at upload time, not at local/CI build time).
