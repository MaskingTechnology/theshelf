
# Logging core | The Shelf

This package contains the definition of the logging operations. It uses a interchangeable driver system for performing the actual operations. A console, in-memory and void driver is included.

## Installation

```bash
npm install @theshelf/logging
```

## How to use

The basic set up looks like this.

```ts
import Logger, { MemoryDriver } from '@theshelf/logging';

const driver = new MemoryDriver();
const logger = new Logger(driver);

// Perform operations with the logger instance
```

## Configuration

The logger has a configurable log level.

```ts
import { LogLevels } from '@theshelf/logging';

logger.logLevel = LogLevels.DEBUG; // default level
```

## Operations

```ts
// Log debug
await logger.debug(message);

// Log info
await logger.info(message);

// Log warning
await logger.warn(message);

// Log error
await logger.error(message);

// Log fatal
await logger.fatal(message);

// Log multiple messages (works for all levels)
await logger.info(message1, message2, ...);

// Logging multiple types of values (works for all levels)
await logger.info('string', new Error('Oops...'), 42, [ 'a', 3.14 ], { name: 'John Doe', age: null });
```

## Value interpretation

Currently, the logger has support for the following types of values:

* All primitive types
* Null / undefined
* Errors (its stack if available or else its message)
* Arrays (all values will be interpreted and concatenated with a space between them)
* Objects (will be stringified)

In case multiple messages are given, they will be concatenated with a space between them.

## Drivers

There are three drivers included in this package. Other drivers are available in separate packages.

### Void

Dummy driver that doesn't log anything (suited for testing). It doesn't have any configuration options or additional operations.

### Memory

In-memory logging (suited for testing). It doesn't have any configuration options, but has an additional operation.

```ts
// Clear the memory
driver.clear();
```

### Console

Driver based on the Node.js console. It doesn't have any configuration options or additional operations.
