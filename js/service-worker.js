self.addEventListener('install', event => console.log('ServiceWorker installed'));
self.addEventListener('notificationclick', event => {
    if (event.action === 'close') {
        event.notification.close();
    } else if (event.action == "markasread") {
        event.notification.close();
        // send request to server
    } else {
        event.waitUntil(self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
            console.log("clients", clients);
            if (clients.length) { // check if at least one tab is already open
                clients[0].focus();
                clients[0].postMessage('Push notification clicked!');
            } else {
                self.clients.openWindow('/');
            }
        }));
    }
});