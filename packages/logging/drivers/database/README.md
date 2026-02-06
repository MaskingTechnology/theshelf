
# Logging Database driver | The Shelf

This package contains the driver implementation for logging to a TheShelf database instance. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/logging @theshelf/database @theshelf/logging-driver-database
```

## How to use

The basic set up looks like this.

```ts
import Database, { MemoryDriver } from '@theshelf/database';
import Logger, { ConsoleDriver } from '@theshelf/logging';
import { DatabaseDriver } from '@theshelf/logging-driver-database';

const database = new Database(new MemoryDriver());

const driver = new DatabaseDriver(
    database, // TheShelf database instance
    'logs', // Database RecordType
    new ConsoleDriver() // optional backup driver (in case the database isn't available)
);

const logger = new Logger(driver);

// Perform operations with the logger instance
```
