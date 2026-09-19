// Network first, cache as fallback: the reviewer always gets the latest
// texts when online, and can keep reading offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open('review-v1').then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
