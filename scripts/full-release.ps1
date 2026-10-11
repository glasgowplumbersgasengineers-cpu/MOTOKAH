$ErrorActionPreference = "Stop"
$ROOT = Split-Path $PSScriptRoot -Parent

. "$PSScriptRoot\android-env.ps1"

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function OK($msg)   { Write-Host "OK: $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "FAIL: $msg" -ForegroundColor Red; exit 1 }

# ── 1. Web build ──────────────────────────────────────────────────────────────
Step "1/5 Web build"
Push-Location $ROOT
npm run build
if ($LASTEXITCODE -ne 0) { Fail "npm build failed" }
OK "Web build done"

# ── 2. Capacitor sync ─────────────────────────────────────────────────────────
Step "2/5 Capacitor sync Android"
npx cap sync android
if ($LASTEXITCODE -ne 0) { Fail "cap sync failed" }
OK "Cap sync done"
Pop-Location

# ── 3. Gradle bundleRelease ───────────────────────────────────────────────────
Step "3/5 Gradle bundleRelease"
Push-Location "$ROOT\android"
.\gradlew.bat bundleRelease
if ($LASTEXITCODE -ne 0) { Fail "Gradle failed" }
$AAB = "$ROOT\android\app\build\outputs\bundle\release\app-release.aab"
if (!(Test-Path $AAB)) { Fail "AAB not found at $AAB" }
OK "AAB built: $AAB"
Pop-Location

# ── 4. Verify signature ───────────────────────────────────────────────────────
Step "4/5 Verify AAB signature"
$verify = & "$env:JAVA_HOME\bin\jarsigner.exe" -verify $AAB 2>&1
if ($LASTEXITCODE -ne 0) { Fail "Signature verify failed: $verify" }
OK "Signature OK"

# ── 5. Publish to Google Play internal track ──────────────────────────────────
Step "5/5 Publish to Google Play"
Push-Location $ROOT
node scripts\google-play-publish.mjs --apply
if ($LASTEXITCODE -ne 0) { Fail "Play publish failed" }
OK "Published to Google Play internal testing!"
Pop-Location

Write-Host "`n✅ ALL DONE — Android 1.8 (versionCode 9) is live on Google Play internal testing." -ForegroundColor Green
