
# Notification web push driver | The Shelf

This package contains the driver implementation for the [web push protocol](https://datatracker.ietf.org/doc/html/draft-ietf-webpush-protocol). This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/notification @theshelf/notification-driver-webpush
```

## How to use

The basic set up looks like this.

```ts
import NotificationService, { WebPushDriver } from '@theshelf/notification';

const driver = new WebPushDriver( /* Configuration */);
const notificationService = new NotificationService(driver);

// Perform operations with the notificationService instance
```

## Configuration

```ts
type WebPushConfiguration = { // Vapid details
    subject: string;
    publicKey: string;
    privateKey: string;
};
```
