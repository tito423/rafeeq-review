// Network first, cache as fallback: the reviewer always gets the latest
// texts when online, and can keep reading offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Only this site's own files. The library books are tens of megabytes on
  // another origin, and a reviewer's phone should not be asked to keep them.
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open('review-v1').then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
