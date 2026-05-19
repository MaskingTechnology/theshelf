
# File Store S3 driver | The Shelf

This package contains the driver implementation for S3 compatible solutions. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/filestore @theshelf/filestore-driver-s3
```

## How to use

The basic set up looks like this.

```ts
import FileStore from '@theshelf/fileStore';
import { S3Driver } from '@theshelf/fileStore-driver-s3';

const driver = new S3Driver({/* Configuration options */});
const fileStore = new FileStore(driver);

// Perform operations with the fileStore instance
```

## Configuration options

```ts
type S3Configuration = {
    clientConfig: S3ClientConfig;
    bucketName: string;
};
```

The exact configuration of the `clientConfig` depends on your S3-compatible storage provider. See the AWS SDK documentation for details.
