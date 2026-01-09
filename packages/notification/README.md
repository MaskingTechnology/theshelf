
# Notification | The Shelf

The notification package provides a universal interaction layer with an actual notification solution.

This package is based on a push notification model.

## Installation

```bash
npm install @theshelf/notification
```

## Drivers

Currently, there are two drivers available:

* **Memory** - non-persistent in memory notifications (suited for testing).
* **WebPush** - web browser based push notifications.

## How to use

The basic set up looks like this.

```ts
import NotificationService, { MemoryDriver | WebPushDriver as SelectedDriver } from '@theshelf/notification';

const driver = new SelectedDriver(/* configuration */);
const notificationService = new NotificationService(driver);

// Perform operations with the notificationService instance
```

### Configuration

#### Memory driver

No configuration options.

#### WebPush driver

```ts
type WebPushConfiguration = { // Vapid details
    subject: string;
    publicKey: string;
    privateKey: string;
};
```

### Operations

```ts
// Open connection
await notificationService.connect();

// Close connection
await notificationService.disconnect();

// Subscribe to receive notifications
await notificationService.subscribe(recipientId);

// Unsubscribe from receiving notifications
// Throws SubscriptionNotFound if subscription not found.
await notificationService.unsubscribe(recipientId);

// Send a notification to a recipient
// Throws SubscriptionNotFound if subscription not found.
await notificationService.sendNotification(recipientId, title, body);
```
