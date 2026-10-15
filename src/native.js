// Bridge between the web app and Android's alarm system (Capacitor Local Notifications).
// Bundled by scripts/build-www.js into www/native.js; exposes window.RakeebNative.
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL = 'rakeeb-alarms';

async function ensureChannel() {
  await LocalNotifications.createChannel({
    id: CHANNEL,
    name: 'Azan and wakt alarms',
    description: 'Rings at azan time and plan reminders',
    importance: 5,
    visibility: 1,
    vibration: true,
    lights: true,
  });
}

window.RakeebNative = {
  isNative: Capacitor.isNativePlatform(),

  // Ask for notification permission and (Android 12+) permission for exact alarms.
  async permissions() {
    let p = await LocalNotifications.checkPermissions();
    if (p.display !== 'granted') p = await LocalNotifications.requestPermissions();
    let exact = 'granted';
    try {
      const e = await LocalNotifications.checkExactNotificationSetting();
      exact = e.exact_alarm;
      if (exact !== 'granted') {
        const r = await LocalNotifications.changeExactNotificationSetting();
        exact = r.exact_alarm;
      }
    } catch (err) { /* older Android: nothing to grant */ }
    return { display: p.display, exact };
  },

  // Replace every scheduled alarm with this list: [{id,title,body,hour,minute,extra}]
  // Each one repeats every day at hour:minute.
  async schedule(list) {
    await ensureChannel();
    const pending = await LocalNotifications.getPending();
    const old = pending.notifications.filter((n) => n.id !== 99);
    if (old.length) await LocalNotifications.cancel({ notifications: old.map((n) => ({ id: n.id })) });
    if (!list.length) return 0;
    await LocalNotifications.schedule({
      notifications: list.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        channelId: CHANNEL,
        schedule: { on: { hour: a.hour, minute: a.minute }, allowWhileIdle: true },
        extra: a.extra || {},
      })),
    });
    return list.length;
  },

  // One-off test alarm a few seconds from now.
  async testIn(seconds) {
    await ensureChannel();
    await LocalNotifications.schedule({
      notifications: [{
        id: 99,
        title: 'Rakeeb test alarm',
        body: 'Alarms are working. Tap to open Rakeeb.',
        channelId: CHANNEL,
        schedule: { at: new Date(Date.now() + seconds * 1000), allowWhileIdle: true },
        extra: {},
      }],
    });
  },
};

// Tapping an alarm opens the app; tell the page which prayer it was for.
LocalNotifications.addListener('localNotificationActionPerformed', (e) => {
  const extra = (e.notification && e.notification.extra) || {};
  window.dispatchEvent(new CustomEvent('rakeeb-native-tap', { detail: extra }));
});
