
# File Store | The Shelf

The file store package provides a universal interaction layer with an actual file storage solution.

## Installation

```bash
npm install @theshelf/filestore
```

## Implementations

Currently, there are three implementations:

* **AWS** - persistent AWS S3 object storage.
* **Memory** - non-persistent in memory storage (suited for testing).
* **S3** - persistent S3 compatible object storage.

## Configuration

The used implementation needs to be configured in the `.env` file.

```env
FILE_STORE_IMPLEMENTATION="minio" # (aws | memory | s3)
```

In case of an S3 compatible storage, additional configuration is required.

```env
S3_END_POINT="http://objectstore.com"
S3_ROOT_USER="development"
S3_ROOT_PASSWORD="secret"
S3_BUCKET_NAME="your-bucket-name"
S3_REGION="local"
```

In case of AWS, additional configuration is required.

```env
AWS_REGION="eu-central-1"
AWS_BUCKET_NAME="your-bucket-name"
```

The AWS S3 client uses the **Default Credential Provider Chain** for authentication. More information can be found in the [AWS  documentation](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html).

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
