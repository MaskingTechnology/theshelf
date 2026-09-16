
# Database core | The Shelf

This package contains the definition of the CRUD operations. It uses an interchangeable driver system for performing the actual operations. An in-memory driver is included.

## Installation

```bash
npm install @theshelf/database
```

## How to use

The basic set up looks like this.

```ts
import Database, { MemoryDriver } from '@theshelf/database';

const driver = new MemoryDriver();
const database = new Database(driver);

// Perform operations with the database instance
```

## Operations

```ts
import { RecordQuery, RecordSort, SortDirections, CreateResult, ReadResult, SearchResult, UpdateResult, DeleteResult } from '@theshelf/database';

// Open connection
await database.connect();

// Close connection
await database.disconnect();

// INSERT INTO items (name, quantity) VALUES (?, ?)
const result: CreateResult = await database.createRecord<T>('items', { name: 'Popcorn', quantity: 3 });

// SELECT * FROM items WHERE id = ?
// Throws `RecordNotFound` if not found
const result: ReadResult<T> = await database.readRecord<T>('items', id);

// SELECT name FROM items WHERE id = ?
const result: ReadResult<T> = await database.readRecord<T>('items', id, ['name']);

// SELECT * FROM items
const result: SearchResult<T> = await database.searchRecords<T>('items', {});

// SELECT name FROM items
const result: SearchResult = await database.searchRecords<T>('items', {}, ['name']);

// SELECT * FROM items WHERE name LIKE "%?%" ORDER BY name ASC LIMIT ? OFFSET ?
const query: RecordQuery<T> = { name: { CONTAINS: name }};
const sort: RecordSort<T> = { name: SortDirections.ASCENDING };
const result: SearchResult<T> = await database.searchRecords<T>('items', query, undefined, sort, limit, offset);

// SELECT name FROM items WHERE name LIKE "?%" OR name LIKE "%?" ORDER BY name ASC, quantity DESC LIMIT ? OFFSET ?;
const query: RecordQuery<T> = { OR: [ { name: { STARTS_WITH: name } }, { name: { ENDS_WITH: name } } ] };
const sort: RecordSort<T> = { name: SortDirections.ASCENDING, quantity: SortDirections.DESCENDING };
const result: SearchResult<T> = await database.searchRecords<T>('items', query, ['name'], sort, limit, offset);

// UPDATE items SET name = ? WHERE id = ?
// Throws `RecordNotFound` if not found
const result: UpdateResult = await database.updateRecord<T>('items', item.id, { 'name': item.name });

// DELETE FROM items WHERE id = ?
// Throws `RecordNotFound` if not found
const result: DeleteResult = await database.deleteRecord<T>('items', item.id);
```

## Results

Each operation returns its own result type for better semantic coding.

## Query options

A basic query has the following structure.

```ts
const query: RecordQuery<T> = { fieldName1: { OPERATOR: value }, fieldName2: { OPERATOR: value }, ...  }
```

The following operators are supported: `EQUALS`, `NOT_EQUALS`, `LESS_THAN`, `LESS_THAN_OR_EQUALS`, `GREATER_THAN`, `GREATER_THAN_OR_EQUALS`, `IN`, `NOT_IN`, `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`

Multiple queries can be grouped using the logical operators: `AND`, `OR`.

```ts
const andQuery: RecordQuery<T> = { AND: [ query1, query2, ...]  }
const orQuery: RecordQuery<T> = { OR: [ query1, query2, ...]  }
```

## Sort options

A basic query has the following structure.

```ts
const sort: RecordSort<T> = { fieldName1: DIRECTION, fieldName2: DIRECTION, ... };
```

The following directions are supported: `ASCENDING`, `DESCENDING`. Both are defined in the `SortDirections` enum.

```ts
const sort: RecordSort<T> = { fieldName1: SortDirections.ASCENDING, fieldName2: SortDirections.DESCENDING, ... };
```

The sort will be performed in the configured order.

## Drivers

There is one driver included in this package. Other drivers are available in separate packages.

### Memory

In-memory database (suited for testing). It doesn't have any configuration options, but has an additional operation.

```ts
// Clear the memory
driver.clear();
```
