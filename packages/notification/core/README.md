
# Notification core | The Shelf

This package contains the core implementation for the notification system.

## Installation

```bash
npm install @theshelf/notification
```

## How to use

The basic set up looks like this.

```ts
import NotificationService, { MemoryDriver } from '@theshelf/notification';

const driver = new MemoryDriver();
const notificationService = new NotificationService(driver);

// Perform operations with the notificationService instance
```

## Operations

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

## Drivers

There is one driver included in this package. Other drivers are available in separate packages.

### Memory

This driver is a non-persistent in-memory implementation (suitable for testing purposes). It doesn't have any configuration options, but has an additional operation.

```ts
// Clear the subscriptions
driver.clear();
```
