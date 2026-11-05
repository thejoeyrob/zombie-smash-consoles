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

## 6. Let GitHub upload to Play for you (optional, after the first manual upload)
Claude cannot log in to Play Console, and you should never share your Google login. The official route is a **service account**:
1. Play Console > **Setup > API access** > link or create a Google Cloud project, then create a **service account** (Google Cloud Console > IAM > Service accounts > Create; role not needed there). Create a **JSON key** for it and download it.
2. Back in Play Console > **Users and permissions** > invite the service account's email address and give it permission to **Release to testing tracks** (and **Release apps to production** later) for Zombie Smash.
3. In `zombie-smash-consoles` > Settings > Secrets > Actions add `PLAY_SERVICE_ACCOUNT_JSON` with the full contents of the JSON key. Never paste it in chat or commit it.
4. Do the **first** upload by hand (Play Console > Testing > Internal or Closed testing > Create release > upload the `.aab` from the "Android AAB" workflow). Google's API cannot claim a brand-new app.
5. After that, Actions > **Android upload to Google Play** > Run workflow chooses the track and sends the signed bundle. Leave status on `draft` so you press Publish yourself.

## 7. Store listing assets (ready in `store/play/`)
| Play Console field | File |
|---|---|
| App icon (512x512) | `store/play/graphics/icon-512.png` |
| Feature graphic (1024x500) | `store/play/graphics/feature-graphic-1024x500.png` |
| Phone screenshots (2 to 8) | `store/play/screenshots/*.png` (1080x2160, the 2:1 maximum Play allows; sides filled with a blurred copy because the iPhone shots are slightly taller) |
| Short description (max 80) | `store/play/short-description.txt` |
| Full description (max 4000) | `store/play/full-description.txt` |
Also fill in: category Games > Action, contact email support@zc2.quest, website https://zc2.quest, privacy policy https://zc2.quest/privacy.html, Data safety form and content rating as in step 5.
