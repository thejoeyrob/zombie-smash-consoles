// Zombie Smash site. Edit LINKS when a store page goes live; a blank link shows "Coming soon" on that button.
const LINKS = {
  appStore: '',            // e.g. https://apps.apple.com/app/zombie-smash/id0000000000 (add after the App Store release)
  googlePlay: '',          // the public Google Play link, once production access is granted
  web: 'https://play.zc2.quest',
  androidTest: 'https://play.google.com/apps/testing/com.thejoeyrob.zombiesmash',
  testerGroup: '',         // the Google Group page testers join first, e.g. https://groups.google.com/g/zombie-smash-testers
};
const SUPPORT = 'support@zc2.quest';

for (const a of document.querySelectorAll('[data-store]')) {
  const url = LINKS[a.dataset.store];
  if (url) { a.href = url; a.removeAttribute('aria-disabled'); a.querySelector('.soon')?.remove(); }
  else { a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); }
}
if (LINKS.testerGroup) { const t = document.getElementById('testers'); if (t) t.hidden = false; }
for (const a of document.querySelectorAll('[data-link]')) { const u = LINKS[a.dataset.link]; if (u) a.href = u; else a.hidden = true; }

// Contact form: opens the visitor's own email app with the message filled in, addressed to support.
function compose(form) {
  const f = new FormData(form);
  const subject = '[Zombie Smash] ' + (f.get('topic') || 'Question');
  const body = [f.get('message') || '', '', '--', 'Name: ' + (f.get('name') || ''), 'Reply to: ' + (f.get('email') || ''),
    'Device: ' + (f.get('device') || ''), 'Sent from: ' + location.hostname].join('\n');
  return `mailto:${SUPPORT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
for (const form of document.querySelectorAll('form.contact')) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.querySelector('.hp input')?.value) return;       // spam trap
    window.location.href = compose(form);
    form.querySelector('.after').hidden = false;
  });
}
for (const b of document.querySelectorAll('[data-copy]')) {
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(SUPPORT); b.textContent = 'Copied'; } catch { b.textContent = SUPPORT; }
    setTimeout(() => (b.textContent = 'Copy address'), 2500);
  });
}
const dlg = document.getElementById('contact');
for (const b of document.querySelectorAll('[data-open-contact]')) b.addEventListener('click', () => (dlg?.showModal ? dlg.showModal() : (location.href = 'support')));
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
for (const b of document.querySelectorAll('[data-close]')) b.addEventListener('click', () => dlg.close());
const dev = document.querySelectorAll('input[name=device]'); for (const d of dev) d.value = navigator.userAgent.slice(0, 120);

// Remove any service worker left behind by the old web game on this address.
try { navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())); caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k))); } catch (e) {}
