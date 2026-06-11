
# Database MongoDB driver | The Shelf

This package contains the driver implementation for MongoDB. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/database @theshelf/database-driver-mongodb
```

## How to use

The basic set up looks like this.

```ts
import Database from '@theshelf/database';
import { MongoDBDriver } from '@theshelf/database-driver-mongodb';

const driver = new MongoDBDriver({/* Configuration options */});
const database = new Database(driver);

// Perform operations with the database instance
```

### Configuration options

```ts
type MongoDBConfiguration = {
    connectionString: string; // e.g. "mongodb://development:development@localhost:27017"
    databaseName: string; // e.g. "mydb"
};
```
