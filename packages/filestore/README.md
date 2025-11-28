
# File Store | The Shelf

The file store package provides a universal interaction layer with an actual file storage solution.

## Installation

```bash
npm install @theshelf/filestore
```

## Implementations

Currently, there are two implementations:

* **Memory** - non-persistent in memory storage (suited for testing).
* **Minio** - persistent S3 compatible object storage.

## Configuration

The used implementation needs to be configured in the `.env` file.

```env
FILE_STORE_IMPLEMENTATION="minio" # (memory | minio)
```

In case of Minio, additional configuration is required.

```env
MINIO_END_POINT="address"
MINIO_PORT_NUMBER=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY="development"
MINIO_SECRET_KEY="secret"
```

## How to use

An instance of the configured file storage implementation can be imported for performing file operations.

```ts
import fileStorage from '@theshelf/filestorage';

// Perform operations with the fileStorage instance
```

### Operations

```ts
import fileStorage from '@theshelf/filestorage';

// Open connection
await fileStorage.connect();

// Close connection
await fileStorage.disconnect();

// Check if a file exists
const exists: boolean = await fileStorage.hasFile('path/to/file.txt');

// Write a file to the storage
const data: Buffer = Buffer.from('Something interesting');
await fileStorage.writeFile('path/to/file.txt', data);

// Read a file from storage
// Throws FileNotFound if not found
const data: Buffer = await fileStorage.readFile('path/to/file.txt');

// Delete a file from storage
// Throws FileNotFound if not found
await fileStorage.deleteFile('path/to/file.txt');
```
