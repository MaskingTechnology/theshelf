
# Logging | The Shelf

The logging package provides a universal interaction layer with an actual logging solution.

## Installation

```bash
npm install @theshelf/logging
```

## Drivers

Currently, there are three drivers available:

* **Void** - dummy driver that doesn't log anything (suited for testing).
* **Memory** - in memory logging (suited for testing).
* **Console** - driver based on the Node.js console.

## How to use

The instance of the logger needs to be imported and one of the drivers must be set.

```ts
import logger, { VoidDriver | MemoryDriver | ConsoleDriver as SelectedDriver } from '@theshelf/logging';

// Set the driver before performing any operation (the Void driver is used by default)
logger.driver = new SelectedDriver(/* configuration */);

// Perform operations with the logger instance
```

### Configuration

The logger instance has a configurable log level.

```ts
import { LogLevels } from '@theshelf/logging';

logger.logLevel = LogLevels.DEBUG; // default level
```

Other levels are: `INFO` | `WARN` | `ERROR` | `FATAL`.

### Void driver

No configuration options.

### Memory driver

No configuration options.

### Console driver

No configuration options.

### Operations

```ts
import logger from '@theshelf/logging';

// Log info
await logger.logInfo(message);

// Log warning
await logger.logWarn(message);

// Log error
await logger.logError(message);

// Log debug information
await logger.logDebug(message);

// Log multiple messages (works for all levels)
await logger.logInfo(message1, message2, ...);

// Logging multiple types of values (works for all levels)
await logger.logInfo('string', new Error('Oops...'), 42, [ 'a', 3.14 ], { name: 'John Doe', age: null });
```

### Value interpretation

Currently, the logger has support for the following types of values:

* All primitive types
* Null / undefined
* Errors (its stack if available or else its message)
* Arrays (all values will be interpreted and concatenated with a space between them)
* Objects (will be stringyfied)

In case multiple messages are given, they will be concatenated with a space between them.
