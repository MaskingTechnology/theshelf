
# File Store | The Shelf

The file store package provides a universal interaction layer with an actual file storage solution.

## Installation

```bash
npm install @theshelf/filestore
```

## Drivers

Currently, there are two drivers available:

* **Memory** - non-persistent in memory storage (suited for testing).
* **Minio** - persistent S3 compatible object storage.

## How to use

The instance of the file store needs to be imported and one of the drivers must be set.

```ts
import fileStore, { MemoryDriver | MinioDriver as SelectedDriver } from '@theshelf/fileStore';

// Set the driver before performing any operation (the Memory driver is used by default)
fileStore.driver = new SelectedDriver(/* configuration */);

// Perform operations with the fileStore instance
```

### Configuration

The file store instance does not have any configuration options.

#### Memory driver

No configuration options.

#### Minio driver

The `ClientOptions` from the 'minio' package.

### Operations

```ts
import fileStore from '@theshelf/fileStore';

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
