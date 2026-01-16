
# File Store | The Shelf

The file store package provides a universal interaction layer with an actual file storage solution.

## Installation

```bash
npm install @theshelf/filestore
```

## Drivers

Currently, there are two drivers available:

* **Memory** - non-persistent in memory storage (suited for testing).
* **S3** - persistent S3 (compatible) object storage.

## How to use

The basic set up looks like this.

```ts
import FileStore, { MemoryDriver | S3Driver as SelectedDriver } from '@theshelf/fileStore';

const driver = new SelectedDriver(/* configuration */);
const fileStore = new FileStore(driver);

// Perform operations with the fileStore instance
```

### Configuration

#### Memory driver

No configuration options.

#### S3 driver

```ts
type S3Configuration = {
    clientConfig: S3ClientConfig;
    bucketName: string;
};
```

The exact configuration of the `clientConfig` depends on your S3-compatible storage provider. See the AWS SDK documentation for details.

### Operations

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
