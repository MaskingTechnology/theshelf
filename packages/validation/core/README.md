
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

type Person = {
    name: string,
    nickname?: string,
    age: string
}

const data = {
    name: 'John Doe',
    age: '42'
};

const schema: ValidationSchema<Person> = {
    name: { message: 'Invalid name', required: true, STRING: { minLength: 4, maxLength: 40 } },
    nickname: { message: 'Invalid nickname', required: false, STRING: { pattern: '^[a-z]+$' } },
    age: { message: 'Invalid age', required: true, NUMBER: { minValue: 18, maxValue: 99 } }
};

// Validate data
const result: ValidationResult = validator.validate<Person>(data, schema);
```

## Validation schema

A basic validation schema has the following structure.

```ts
const schema: ValidationSchema<CustomType> = {
    fieldName1: { TYPE: { /* type options */ } },
    fieldName2: { TYPE: { /* type options */ } },
    ...
}
```

**Note** that a custom validation error `message` can optionally be set per field.

The following types are supported:

* **STRING**
  * `minLength?: number`
  * `maxLength?: number`
  * `pattern?: string`
* **NUMBER**
  * `minValue?: number`
  * `maxValue?: number`
* **ARRAY**
  * `minLength?: number`
  * `maxLength?: number`
  * `validations?: Partial<Validation>`
* **BOOLEAN**
  * (no additional properties)
* **DATE**
  * (no additional properties)
* **DATE_STRING**
  * (no additional properties)
* **DATETIME_STRING**
  * (no additional properties)
* **TIME_STRING**
  * (no additional properties)
* **UUID**
  * (no additional properties)
* **EMAIL**
  * (no additional properties)
* **URL**
  * (no additional properties)

## Validation result

The validation result has two fields:

* **invalid** - boolean indicating if at least one of the fields is invalid.
* **messages** - map containing the validation error messages per field.
