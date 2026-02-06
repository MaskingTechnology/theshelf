
# Validation core | The Shelf

This package contains the definition of the validation operations. It uses a interchangeable driver system for performing the actual operations.

## Installation

```bash
npm install @theshelf/validation
```

## How to use

The basic set up looks like this.

```ts
import Validator from '@theshelf/validation';
import driver from '/path/to/driver';

const validator = new Validator(driver);

// Perform operations with the validator instance
```

## Operations

```ts
import { ValidationSchema, ValidationResult } from '@theshelf/validation';

const data = {
    name: 'John Doe',
    age: '42'
};

const schema: ValidationSchema = {
    name: { message: 'Invalid name', STRING: { required: true, minLength: 4, maxLength: 40 } },
    nickname: { message: 'Invalid nickname', STRING: { required: false, , pattern: '^[a-z]+$' } },
    age: { message: 'Invalid age', NUMBER: { required: true, minValue: 18, maxValue: 99 } }
};

// Validate data
const result: ValidationResult = validator.validate(data, schema);
```

## Validation schema

A basic validation schema has the following structure.

```ts
const schema: ValidationSchema = {
    fieldName1: { TYPE: { /* type options */ } },
    fieldName2: { TYPE: { /* type options */ } },
    ...
}
```

**Note** that a custom validation error `message` can optionally be set per field.

The following types are supported:

* **STRING**
  * `required: boolean`
  * `minLength?: number`
  * `maxLength?: number`
  * `pattern?: string`
* **NUMBER**
  * `required: boolean`
  * `minValue?: number`
  * `maxValue?: number`
* **ARRAY**
  * `required: boolean`
  * `minLength?: number`
  * `maxLength?: number`
  * `validations?: Partial<Validation>`
* **BOOLEAN**
  * `required: boolean`
* **DATE**
  * `required: boolean`
* **UUID**
  * `required: boolean`
* **EMAIL**
  * `required: boolean`
* **URL**
  * `required: boolean`

## Validation result

The validation result has two fields:

* **invalid** - boolean indicating if at least one of the fields is invalid.
* **messages** - map containing the validation error messages per field.
