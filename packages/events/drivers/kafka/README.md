
# Event broker Kafka driver | The Shelf

This package contains the driver implementation for Kafka. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/events @theshelf/events-driver-kafka
```

## How to use

The basic set up looks like this.

```ts
import EventBroker from '@theshelf/events';
import { KafkaDriver } from '@theshelf/events-driver-kafka';

const driver = new KafkaDriver({/* Configuration options */});
const eventBroker = new EventBroker(driver);

// Publish and subscribe with the event broker
```

### Configuration options

```ts
type KafkaConfiguration = {
    readonly brokers: string[]; // e.g. my-kafka-cluster.local:9092
    readonly groupId: string; // e.g. prod.domain.social
    readonly clientId: string;// e.g. prod.domain.social.creator
};
```
