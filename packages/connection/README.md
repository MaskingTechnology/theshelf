

# Connection | The Shelf

The connection package provides connection resilience for other TheShelf packages by monitoring and restoring connections to external services. It wraps a connectable (such as a database or event broker) and manages its connection lifecycle, ensuring robust error handling and automatic recovery.

## Features

- **Automatic Connection Monitoring:** Periodically checks and restores lost connections.
- **Graceful Error Handling:** Connection errors are caught, logged, and do not block application startup.
- **Configurable Monitoring Interval:** Set custom timeouts for connection checks.
- **State Management:** Tracks connection states (`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `DISCONNECTING`).
- **Pluggable Logging:** Integrates with any logger implementing the `@theshelf/logging` interface.

## Installation

```bash
npm install @theshelf/connection
```

## Configuration

Create a `ConnectionManager` by providing a configuration object:

```ts
const manager = new ConnectionManager({
    name: 'DATABASE', // Unique name for logging
    connectable, // Must implement Connectable interface (all TheShelf packages are compatible)
    logger, // Must implement Logger interface
    monitoringTimeout: 3000 // Optional, default: 3000ms
});
```

**Configuration Properties:**

- `name` (string): Unique identifier for the connection (used in logs).
- `connectable` (Connectable): The object to manage (must implement `connect()` and `disconnect()` methods, and a `connected` property).
- `logger` (Logger): Logger instance for info, warn, error, and debug messages.
- `monitoringTimeout` (number, optional): Interval in milliseconds for connection monitoring (default: 3000).

## API Reference

### `ConnectionManager`

#### Properties

- `name`: Returns the name of the connection.
- `state`: Returns the current connection state.

#### Methods

- `connect(): Promise<void>`
    - Initiates connection. If already connected or connecting, logs a warning.
    - Starts monitoring after successful connection.
- `disconnect(): Promise<void>`
    - Disconnects the connectable. If already disconnected or disconnecting, logs a warning.
    - Stops monitoring after disconnect.

## Monitoring & Recovery

After connecting, the manager periodically checks the connection status:

- If the connection is lost, it logs a warning and attempts to reconnect automatically.
- Monitoring can be started/stopped manually via `connect()` and `disconnect()`.

## Error Handling

- **Connection Errors:**
    - Errors during `connect()` are caught, logged, and do not throw (non-blocking).
    - The manager will keep trying to reconnect at each monitoring interval.
- **Disconnection Errors:**
    - Errors during `disconnect()` are logged and re-thrown.

## Example Usage

```ts
import ConnectionManager from '@theshelf/connection';
import { database } from './your-database-instance';
import { logger } from './your-logger-instance';

const manager = new ConnectionManager({
    name: 'DATABASE',
    connectable: database, // a @theshelf/database instance
    monitoringTimeout: 3000, // optional, default: 3000
    logger // must be a @theshelf/logging instance
});

// Connect and start monitoring
await manager.connect();

// ... your application logic ...

// Disconnect and stop monitoring
await manager.disconnect();
```

## Connectable Interface

Your connectable object should implement the following interface:

```ts
interface Connectable {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    connected: boolean;
}
```
