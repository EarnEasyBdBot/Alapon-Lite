// sw.js — Network First (Always fetch fresh updates on refresh)
const CACHE_NAME = 'alapon-live-v3';

self.addEventListener('install', (event) => {
  // নতুন আপডেট আসা মাত্র আগের সার্ভিস ওয়ার্কার বন্ধ করে নতুনটা চালু করবে
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // পুরনো সব ক্যাশ ডিলিট করে নতুন ভার্সন একটিভ করবে
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Supabase API বা POST রিকোয়েস্ট ক্যাশ হবে না
  if (event.request.method !== 'GET' || event.request.url.includes('supabase.co')) {
    return;
  }

  // Network First Strategy: আগে সার্ভার থেকে নতুন ফাইল আনবে, ইন্টারনেট না থাকলে ক্যাশ থেকে নিবে
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
