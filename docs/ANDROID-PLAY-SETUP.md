# Android and Google Play: step by step

## What is already built
`phone/android/` is the Android app (Capacitor), id `com.thejoeyrob.zombiesmash`, with the Zombie Smash icon. The workflow **Android AAB (Google Play)** assembles the phone console with the pinned game cartridge, runs the tests and produces a signed `.aab`. It has **not** yet been run on GitHub, so expect small fixes the first time.

## 1. Google Play developer account (you)
1. Go to play.google.com/console and sign up (one-time fee about $25; check the current amount). Choose *Personal* or *Organisation*. Organisation accounts need a D-U-N-S number; personal accounts have extra testing rules (see step 5).
2. Complete identity verification. This can take days, so do it first.

## 2. Create the app in Play Console
Create app > fill in:
- App name: `Zombie Smash`
- Package name: **`com.thejoeyrob.zombiesmash`** (exactly; it must match `applicationId` in `phone/android/app/build.gradle`). Press *Check availability*. The package name cannot be changed after the app is created, so do not type anything else.
- Default language, **App** (not Game category yet; set the category to Games later in the store listing), **Free**. Accept the declarations.

## 3. Create the upload key (once)
On any computer with Java (or ask Claude to guide you):
```
keytool -genkeypair -v -keystore zombie-smash-upload.keystore -alias zombiesmash -keyalg RSA -keysize 2048 -validity 10000
```
Choose strong passwords. **Back up the .keystore file and passwords somewhere safe outside GitHub.** Then in `zombie-smash-consoles` > Settings > Secrets > Actions add:
- `ANDROID_KEYSTORE_B64`: the file as base64 (`base64 -w0 zombie-smash-upload.keystore`)
- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`zombiesmash`), `ANDROID_KEY_PASSWORD`

Play App Signing (default) means Google holds the final signing key, so a lost upload key can be reset through Play Support.

## 4. Build the bundle
Actions > **Android AAB (Google Play)** > Run workflow. Download the `.aab` from the run's Artifacts.

## 5. Testing, then production
Check Google's current rules in Play Console (Dashboard > "Set up your app / testing requirements"). To my knowledge new personal accounts must run a **closed test** with about 12 to 20 testers for 14 days before applying for production.
1. Testing > Closed testing > create track > upload the `.aab`, add testers (email list), publish.
2. Store listing: description, screenshots (phone), 512x512 icon, 1024x500 feature graphic.
3. App content: privacy policy URL (`https://zc2.quest/privacy`), **Data safety** form (same answers as the App Store privacy label: device ID and leaderboard name/score collected for app functionality, not tracking), content rating questionnaire (cartoon violence), target audience (13+ suggested), ads: none.
4. Support email: the zc2.quest support address.
