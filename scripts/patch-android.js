// Adds the permissions Android needs for alarms that ring at an exact time.
const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(file, 'utf8');
const perms = [
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_EXACT_ALARM',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
];
const add = perms.filter((p) => !xml.includes(p)).map((p) => `    <uses-permission android:name="${p}" />`).join('\n');
if (add) xml = xml.replace('<application', add + '\n\n    <application');
fs.writeFileSync(file, xml);
console.log('Manifest patched:', perms.length, 'permissions ensured');
