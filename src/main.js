const PusherPushNotifications = require('@pusher/push-notifications-web');

const styles = require('./main.css');

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js?v=1').then(registration => {
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: '7555955f-92cb-4df6-8423-f223ee51f8be',
        serviceWorkerRegistration: registration
      });

      beamsClient.start()
        .then(() => beamsClient.addDeviceInterest('district-line'))
        .then(() => console.log('Successfully registered and subscribed!'))
        .catch(console.error);
    });
  }
})