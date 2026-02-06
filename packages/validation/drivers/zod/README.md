
# Validation Zod driver | The Shelf

This package contains the driver implementation for Zod. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/validation @theshelf/validation-driver-zod
```

## How to use

The basic set up looks like this.

```ts
import Validator from '@theshelf/validation';
import { ZodDriver } from '@theshelf/validation-driver-zod';

const driver = new ZodDriver();
const validator = new Validator(driver);

// Perform operations with the validator instance
```
