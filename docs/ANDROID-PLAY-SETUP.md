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
1. In Google Cloud Console (project `zc2-arena` is fine) > **APIs & Services > Library** > enable **Google Play Android Developer API**. Then **IAM & Admin > Service accounts > Create service account** (name `play-publisher`; no roles needed) and add a **JSON key** (Keys tab > Add key > JSON). The file downloads once.
2. In Play Console > **Users and permissions** > **Invite new users** > paste the service account's email address (it looks like `play-publisher@zc2-arena.iam.gserviceaccount.com`) > give it app permissions for Zombie Smash: **Release to testing tracks**, **Manage store presence**, **View app information**, and later **Release apps to production**. (Play's menus change; if you cannot find the invite option, tell Claude what you see.)
3. In `zombie-smash-consoles` > Settings > Secrets > Actions add `PLAY_SERVICE_ACCOUNT_JSON` with the full contents of the JSON key. Never paste it in chat or commit it.
4. Do the **first** upload by hand (Play Console > Testing > Internal or Closed testing > Create release > upload the `.aab` from the "Android AAB" workflow). Google's API cannot claim a brand-new app.
5. After that, Actions > **Android upload to Google Play** > Run workflow chooses the track and sends the signed bundle. Leave status on `draft` so you press Publish yourself.

## 7. Store listing assets (ready in `store/play/`)
| Play Console field | File |
|---|---|
| App icon (512x512) | `store/play/graphics/icon-512.png` |
| Feature graphic (1024x500) | `store/play/graphics/feature-graphic-1024x500.png` (made from the owner's key art in `store/art/`; the source is only 719x308, so a larger original would sharpen it) |
| Phone screenshots (2 to 8) | `store/play/screenshots/*.png` (1080x1920, exactly 9:16 as the Play form requires; sides filled with a blurred copy because the iPhone shots are taller) |
| Short description (max 80) | `store/play/short-description.txt` |
| Full description (max 4000) | `store/play/full-description.txt` |
Also fill in: category Games > Action, contact email support@zc2.quest, website https://zc2.quest, privacy policy https://zc2.quest/privacy.html, Data safety form and content rating as in step 5.

## 8. What the API can and cannot do for you
**Can (once the service account is set up):** upload new builds to any track (workflow "Android upload to Google Play"), push the store text, icon, feature graphic and screenshots (workflow "Android push store listing to Google Play"), and promote a release between tracks. **Cannot:** the app declarations (Data safety, content rating, target audience, app access, privacy policy), accepting Google's agreements, creating the app, identity verification, or recruiting your 12 closed testers. Those are one-time forms in Play Console.

## 9. Quick start for write access (service account)
1. Google Cloud Console (project `zc2-arena`): **APIs & Services > Library** > enable **Google Play Android Developer API**.
2. **IAM & Admin > Service accounts > Create** (`play-publisher`, no roles), then **Keys > Add key > Create new key > JSON**. The file downloads once.
3. Play Console > **Users and permissions > Invite new users** > paste the service account email. Under app permissions for Zombie Smash tick: **View app information**, **Release to testing tracks**, **Manage store presence**. Leave production release and admin permissions off for now.
4. GitHub `zombie-smash-consoles` > Settings > Secrets > Actions > new secret `PLAY_SERVICE_ACCOUNT_JSON` = the whole JSON file contents.
5. Run Actions > **Android Google Play status check** to prove it works (read-only). Then **Android push store listing to Google Play** and **Android upload to Google Play** work too.
