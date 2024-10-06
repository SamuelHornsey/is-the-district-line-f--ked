self.addEventListener('push', (event) => {
  let payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: `${self.location.origin}/notification.png`,
      badge: `${self.location.origin}/notification.png`
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(self.location.origin)
  );
});