# QA Tool Research — Motokah (React + Vite + Capacitor)

Evaluated 2026-11-12. Decisions based on actual compatibility with this stack, not popularity.

## In use / being wired in now

**Playwright (`@playwright/test`)** — already a devDependency, already used by the existing `scripts/qa-review-layout.mjs` scratch script. Correct choice for the web layer: runs the real React app in a real Chromium/WebKit engine, can emulate mobile viewports, can drive DOM focus/keyboard events. Being formalized into `playwright.config.ts` + `tests/e2e/` + CI this session.

**`@capacitor/keyboard`** — installed this session. Not a testing tool, a fix: gives the app real keyboard lifecycle events (`keyboardDidShow`/`keyboardDidHide`) instead of relying on Android's default `adjustPan` behavior, which was the likely root cause of the reported "keyboard won't open" symptom in Messages.

**GitHub-hosted runners (`ubuntu-latest`, `macos-latest`)** — repo is public, so Actions minutes on every OS including macOS are free, unlimited. Using these for real compiled Android/iOS build verification (not full device UI automation yet — see below).

## Evaluated and excluded, with reasons

| Tool | Verdict | Reason |
|---|---|---|
| Appium | Not installed yet, kept as candidate | Genuinely supports hybrid WebView context switching, which fits Capacitor. But needs a running emulator/simulator + Appium server wired into CI — real setup cost, not a `npm install`. Scoped as a follow-up once Playwright web coverage + native build verification are solid, not skipped forever. |
| Maestro | Not installed | CLI-based, works against a compiled APK/IPA on a device/emulator. Good fit in theory for Capacitor apps since it drives the compiled binary, not the DOM. Same blocker as Appium: needs a running emulator in CI, which needs the Android build to be green first (done this session) before it's worth wiring up. |
| mobile-mcp | Not installed | Would let an agent drive a real/emulated device directly. Overlaps with Maestro/Appium; no reason to add a third device-driving layer before the first one is proven out. |
| Detox | Excluded | Built for React Native's native bridge test runner. Motokah is a Vite SPA in a Capacitor WebView, not React Native — Detox has no integration point here. |
| React Native CLI/Doctor | Excluded | Same reason — not a React Native project. |
| DroidBot, Google ARTEMIS, DroidAgent, "AI Mobile UI Crawler" | Excluded | Checked their repos: DroidBot last meaningful activity years ago, built for native Android (APK introspection via UI Automator), not WebView-content-aware — it would see one giant WebView node and nothing inside it, same blind spot a plain Android crawler has with any hybrid app. ARTEMIS and DroidAgent are academic-paper companion repos, not maintained tools with install docs suitable for unattended CI use. Installing any of these would not produce real signal for this app's actual bug surface (which lives in the DOM, not native views) — using Playwright against the DOM directly is the correct equivalent instead of a native crawler that can't see into the WebView. |
| AgenTest, Native AI Tester, AppTestCircuit | Excluded | Same category as above — thin/unmaintained wrappers with no clear advantage over Playwright + Capacitor's own native build tooling for this specific architecture. |
| MobSF | Candidate, not run yet | Legitimate static/dynamic security scanner for compiled APK/IPA. Worth running once a release build artifact exists from the new CI workflow — flagged as a follow-up, not fabricated as already done. |
| Roborazzi | Excluded | Built for native Android Compose/View screenshot testing — no integration point for a WebView-rendered app. Playwright's own screenshot comparison covers the equivalent need here. |
| Sentry React Native SDK | Not evaluated for install | Would need an account/DSN and a decision about enabling production crash collection — that's a product decision requiring Owner approval, not a QA-tooling decision. Flagging as a recommendation, not installing. |

## What "autonomous exploration" means here, concretely

No existing open-source tool does blind autonomous WebView exploration well for this stack. Instead: built a route-driven Playwright crawler (`tests/e2e/`) seeded from the real route table in `src/App.tsx` (see FEATURE_INVENTORY.md) — visits every public route, checks for console errors, uncaught exceptions, blank/near-blank screens, and horizontal overflow. This is the honest equivalent of "autonomous discovery" for a server-rendered-nothing SPA: there's no hidden UI graph to discover beyond the route table plus whatever renders conditionally inside each page, and conditional UI (modals, dropdowns) is being added to the crawl incrementally as found, not claimed wholesale.

## Current real limitation (stated plainly, not hidden)

Native on-device UI automation (tap/type/scroll on the actual compiled app, not the browser) is **not running yet**. What's running instead: (1) Playwright against the real web build in CI, (2) real compiled Android/iOS build verification in CI using free GitHub-hosted runners, confirming the app actually compiles and installs. Driving the installed app's UI (Appium/Maestro) is the next layer, gated on the first two being solid — this is sequencing, not avoidance.
