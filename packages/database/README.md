
# Database | The Shelf

The database integration provides a universal interaction layer with an actual data storage solution.

This integration is based on simple CRUD operations and purposely does NOT support relational querying.

## Installation

```bash
npm install @theshelf/database
```

## Drivers

Currently, there are two drivers available:

* **Memory** - non-persistent in memory storage (suited for testing).
* **MongoDB** - persistent document storage.

## How to use

The basic set up looks like this.

```ts
import Database, { MemoryDriver | MongoDBDriver as SelectedDriver } from '@theshelf/database';

const driver = new SelectedDriver(/* configuration */);
const database = new Database(driver);

// Perform operations with the database instance
```

### Configuration

#### Memory driver

No configuration options.

#### MongoDB driver

```ts
type MongoDBConfiguration = {
    connectionString: string; // e.g. "mongodb://development:development@localhost:27017"
    databaseName: string; // e.g. "mydb"
};
```

### Operations

```ts
import { RecordData, RecordQuery, RecordSort, SortDirections } from '@theshelf/database';

// Open connection
await database.connect();

// Close connection
await database.disconnect();

// INSERT INTO items (name, quantity) VALUES (?, ?)
const id: string = await database.createRecord('items', { name: 'Popcorn', quantity: 3 });

// SELECT * FROM items WHERE id = ?
// Throws `RecordNotFound` if not found
const record: RecordData = await database.readRecord('items', id);

// SELECT name FROM items WHERE id = ?
const record: RecordData = await database.readRecord('items', id, ['name']);

// SELECT * FROM items
const records: RecordData[] = await database.searchRecords('items', {});

// SELECT name FROM items
const records: RecordData[] = await database.searchRecords('items', {}, ['name']);

// SELECT * FROM items WHERE id = ? LIMIT 1 OFFSET 0
const records: RecordData | undefined = await database.findRecord('items', { id }, undefined, undefined, 1, 0);

// SELECT * FROM items WHERE name LIKE "%?%" ORDER BY name ASC LIMIT ? OFFSET ?
const query: RecordQuery = { name: { CONTAINS: name }};
const sort: RecordSort = { name: SortDirections.ASCENDING };
const records: RecordData[] = await database.searchRecords('items', query, undefined, sort, limit, offset);

// SELECT name FROM items WHERE name LIKE "?%" OR name LIKE "%?" ORDER BY name ASC, quantity DESC LIMIT ? OFFSET ?;
const query: RecordQuery = { OR: [ { name: { STARTS_WITH: name } }, { name: { ENDS_WITH: name } } ] };
const sort: RecordSort = { name: SortDirections.ASCENDING, quantity: SortDirections.DESCENDING };
const records: RecordData[] = await database.searchRecords('items', query, ['name'], sort, limit, offset);

// UPDATE items SET name = ? WHERE id = ?
// Throws `RecordNotFound` if not found
await database.updateRecord('items', item.id, { 'name': item.name });

// DELETE FROM items WHERE id = ?
// Throws `RecordNotFound` if not found
await database.deleteRecord('items', item.id);
```

### Query options

A basic query has the following structure.

```ts
const query: RecordQuery = { fieldName1: { OPERATOR: value }, fieldName2: { OPERATOR: value }, ...  }
```

The following operators are supported: `EQUALS`, `NOT_EQUALS`, `LESS_THAN`, `LESS_THAN_OR_EQUALS`, `GREATER_THAN`, `GREATER_THAN_OR_EQUALS`, `IN`, `NOT_IN`, `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`

Multiple queries can be grouped using the logical operators: `AND`, `OR`.

```ts
const andQuery: RecordQuery = { AND: [ query1, query2, ...]  }
const orQuery: RecordQuery = { OR: [ query1, query2, ...]  }
```

### Sort options

A basic query has the following structure.

```ts
const sort: RecordSort = { fieldName1: DIRECTION, fieldName2: DIRECTION, ... };
```

The following directions are supported: `ASCENDING`, `DESCENDING`. Both are defined in the `SortDirections` enum.

```ts
const sort: RecordSort = { fieldName1: SortDirections.ASCENDING, fieldName2: SortDirections.DESCENDING, ... };
```

The sort will be performed in the configured order.
