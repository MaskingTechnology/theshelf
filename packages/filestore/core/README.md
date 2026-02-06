
# File Store core | The Shelf

This package contains the definition of the file operations. It uses a interchangeable driver system for performing the actual operations. An in-memory driver is included.

## Installation

```bash
npm install @theshelf/filestore
```

## How to use

The basic set up looks like this.

```ts
import FileStore, { MemoryDriver } from '@theshelf/fileStore';

const driver = new MemoryDriver();
const fileStore = new FileStore(driver);

// Perform operations with the fileStore instance
```

## Operations

```ts
// Open connection
await fileStore.connect();

// Close connection
await fileStore.disconnect();

// Check if a file exists
const exists: boolean = await fileStore.hasFile('path/to/file.txt');

// Write a file to the storage
const data: Buffer = Buffer.from('Something interesting');
await fileStore.writeFile('path/to/file.txt', data);

// Read a file from storage
// Throws FileNotFound if not found
const data: Buffer = await fileStore.readFile('path/to/file.txt');

// Delete a file from storage
// Throws FileNotFound if not found
await fileStore.deleteFile('path/to/file.txt');
```
