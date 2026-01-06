
# Validation | The Shelf

The validation package provides a universal interaction layer with an actual data validation solution.

## Installation

```bash
npm install @theshelf/validation
```

## Drivers

Currently, there is only one driver available:

* **Zod** - driver for the currently popular Zod library.

## How to use

The instance of the validator needs to be imported and one of the drivers must be set.

```ts
import validator, { Zod as SelectedDriver } from '@theshelf/validation';

// Set the driver before performing any operation (the Zod driver is used by default)
validator.driver = new SelectedDriver(/* configuration */);

// Perform operations with the validator instance
```

### Configuration

The validator instance does not have any configuration options.

#### Zod driver

No configuration options.

### Operations

```ts
import validator, { ValidationSchema, ValidationResult } from '@theshelf/validation';

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

### Validation scheme options

A basic validation scheme has the following structure.

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

### Validation result structure

The validation result has two fields:

* **invalid** - boolean indicating if at least one of the fields is invalid.
* **messages** - map containing the validation error messages per field.
