# Rakeeb — Android app

Rakeeb with real azan alarms. Alarms ring at azan time even when the app is closed.

## Get the APK (no coding, no Android Studio)

1. Make a free account at github.com and create a **new repository** (private is fine).
2. Upload everything in this folder to it (drag and drop in the browser:
   "Add file" → "Upload files"). Make sure the `.github` folder is included.
3. Open the repository's **Actions** tab. The build starts by itself
   (or press "Build Android APK" → "Run workflow"). It takes about 5-8 minutes.
4. When it turns green, open the run and download **Rakeeb-apk** at the bottom.
   Unzip it to get `Rakeeb.apk`.
5. Send `Rakeeb.apk` to your phone and open it. Android will ask to allow
   "install unknown apps" for the app you opened it from — allow it once.

## Updating the app later

Upload the changed files to GitHub (the same drag-and-drop), wait for the green tick in
**Actions**, download the new **Rakeeb-apk** and open it on the phone. Because every build is
signed with the same key (`debug.keystore`), it installs over the old app and keeps your data.
In Rakeeb, ⚙ Settings → bottom shows the build label, so you can check which version is installed.

## First run on the phone

1. Open Rakeeb → ⚙ Settings → **Wakt alarms**. Check your prayer times first.
2. Turn on **Alarm at azan time** (and, if you like, the plan reminder).
3. Tap **Save settings**. Allow notifications, and allow **Alarms & reminders**
   if Android asks.
4. Tap **Test alarm in 10 seconds**, close the app, and check that it rings.
5. If alarms are late or missing on your phone, turn off battery optimisation
   for Rakeeb: Settings → Apps → Rakeeb → Battery → Unrestricted.

## Notes

- Alarm times come from the prayer times in Settings; they do not change by themselves.
- Data is stored on the phone only. Uninstalling the app deletes it.
- The alarm sound is the notification sound of the "Azan and wakt alarms" channel:
  Settings → Apps → Rakeeb → Notifications → Azan and wakt alarms → Sound.
- To change the app: edit `src/index.html`, push, and download the new APK.
