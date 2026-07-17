$ErrorActionPreference = "Stop"

. "$PSScriptRoot\android-env.ps1"

$androidDir = Join-Path (Split-Path $PSScriptRoot -Parent) "android"
$keystoreFile = Join-Path $androidDir "motokah-upload-key.jks"
$propertiesFile = Join-Path $androidDir "keystore.properties"

if (!(Test-Path $keystoreFile)) {
  if (!$env:MOTOKAH_KEYSTORE_PASSWORD -or !$env:MOTOKAH_KEY_PASSWORD) {
    throw "Missing MOTOKAH_KEYSTORE_PASSWORD and MOTOKAH_KEY_PASSWORD. Set them before creating the release key."
  }

  & "$env:JAVA_HOME\bin\keytool.exe" -genkeypair `
    -v `
    -keystore $keystoreFile `
    -alias motokah-upload `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass $env:MOTOKAH_KEYSTORE_PASSWORD `
    -keypass $env:MOTOKAH_KEY_PASSWORD `
    -dname "CN=Motokah, OU=Mobile, O=Motokah, L=Dar es Salaam, ST=Dar es Salaam, C=TZ"
}

if (!(Test-Path $propertiesFile)) {
  if (!$env:MOTOKAH_KEYSTORE_PASSWORD -or !$env:MOTOKAH_KEY_PASSWORD) {
    throw "Missing MOTOKAH_KEYSTORE_PASSWORD and MOTOKAH_KEY_PASSWORD. Set them before writing keystore.properties."
  }

  @"
storePassword=$env:MOTOKAH_KEYSTORE_PASSWORD
keyPassword=$env:MOTOKAH_KEY_PASSWORD
keyAlias=motokah-upload
storeFile=motokah-upload-key.jks
"@ | Set-Content -Path $propertiesFile -Encoding ASCII
}

Push-Location $androidDir
try {
  .\gradlew.bat bundleRelease
  $aab = Join-Path $androidDir "app\build\outputs\bundle\release\app-release.aab"
  & "$env:JAVA_HOME\bin\jarsigner.exe" -verify -verbose -certs $aab | Select-Object -First 30
  Write-Host "Release bundle: $aab"
} finally {
  Pop-Location
}
