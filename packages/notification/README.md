
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

The instance of the notification service needs to be imported and one of the drivers must be set.

```ts
import notificationService, { FetchDriver as SelectedDriver } from '@theshelf/notification';

// Perform operations with the notificationService instance
```

### Configuration

The notification service instance does not have any configuration options.

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
import notificationService, { MemoryDriver | WebPushDriver as SelectedDriver } from '@theshelf/notification';

// Set the driver before performing any operation (the Memory driver is used by default)
fileStore.driver = new SelectedDriver(/* configuration */);

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
