
import { z } from 'zod';
import type { $ZodIssue, $ZodIssueUnrecognizedKeys } from 'zod/v4/core';

import { ValidationResult, MAX_EMAIL_LENGTH, MAX_URL_LENGTH } from '@theshelf/validation';
import type { Driver, ValidationProperties, Validation, ValidationSchema, ValidationTypes } from '@theshelf/validation';

type ValidationType = keyof ValidationTypes;
type GenericConstraints = ValidationTypes[ValidationType] & ValidationProperties;
type Constraints<T extends ValidationType> = ValidationTypes[T] & ValidationProperties;
type ValidatorFunction = (constraints: GenericConstraints, required: boolean) => z.ZodTypeAny;

// Zod is so type heavy that we've chosen for inferred types to be used.
// This is a trade-off between readability and verbosity.

export default class Zod implements Driver
{
    readonly #validators = new Map<string, ValidatorFunction>();

    constructor()
    {
        this.#validators.set('string', (constraints: Constraints<'STRING'>, required: boolean) => this.#validateString(constraints, required));
        this.#validators.set('number', (constraints: Constraints<'NUMBER'>, required: boolean) => this.#validateNumber(constraints, required));
        this.#validators.set('boolean', (constraints: Constraints<'BOOLEAN'>, required: boolean) => this.#validateBoolean(constraints, required));
        this.#validators.set('date', (constraints: Constraints<'DATE'>, required: boolean) => this.#validateDate(constraints, required));
        this.#validators.set('datetime', (constraints: Constraints<'DATETIME'>, required: boolean) => this.#validateDateTime(constraints, required));
        this.#validators.set('uuid', (constraints: Constraints<'UUID'>, required: boolean) => this.#validateUuid(constraints, required));
        this.#validators.set('email', (constraints: Constraints<'EMAIL'>, required: boolean) => this.#validateEmail(constraints, required));
        this.#validators.set('array', (constraints: Constraints<'ARRAY'>, required: boolean) => this.#validateArray(constraints, required));
        this.#validators.set('url', (constraints: Constraints<'URL'>, required: boolean) => this.#validateUrl(constraints, required));
        this.#validators.set('enum', (constraints: Constraints<'ENUM'>, required: boolean) => this.#validateEnum(constraints, required));
    }

    get name(): string { return Zod.name; }

    validate(data: unknown, schema: ValidationSchema): ValidationResult
    {
        const validator = this.#buildValidator(schema);

        const result = validator.safeParse(data);

        if (result.success === false)
        {
            const issues = result.error.issues;

            const messages = this.#getMessages(issues, schema);

            return new ValidationResult(true, messages);
        }

        return new ValidationResult(false);
    }

    #buildValidator(schema: ValidationSchema)
    {
        return Object.entries(schema)
            .reduce((partialSchema, [key, value]) => 
            {
                const fieldValidator = this.#getFieldValidator(value);

                return partialSchema.extend({ [key]: fieldValidator });

            }, z.object({})
            ).strict();
    }

    #getFieldValidator(schema: Validation)
    {
        const required = schema.required === true;

        for (const key of Object.keys(schema))
        {
            const type = key.toLowerCase();

            const validator = this.#validators.get(type);

            if (validator === undefined) continue;

            const constraints = schema[key as ValidationType] as GenericConstraints;

            return validator(constraints, required);
        }

        return z.never();
    }

    #validateString(constraints: Constraints<'STRING'>, required: boolean)
    {
        let validation = z.string();

        if (constraints.minLength !== undefined) validation = validation.min(constraints.minLength);
        if (constraints.maxLength !== undefined) validation = validation.max(constraints.maxLength);
        if (constraints.pattern !== undefined) validation = validation.regex(new RegExp(constraints.pattern));

        return this.#checkRequired(validation, required);
    }

    #validateNumber(constraints: Constraints<'NUMBER'>, required: boolean)
    {
        let validation = z.number();

        if (constraints.minValue !== undefined) validation = validation.min(constraints.minValue);
        if (constraints.maxValue !== undefined) validation = validation.max(constraints.maxValue);

        return this.#checkRequired(validation, required);
    }

    #validateBoolean(constraints: Constraints<'BOOLEAN'>, required: boolean)
    {
        const validation = z.boolean();

        return this.#checkRequired(validation, required);
    }

    #validateDate(constraints: Constraints<'DATE'>, required: boolean)
    {
        const validation = z.iso.date();

        return this.#checkRequired(validation, required);
    }

    #validateDateTime(constraints: Constraints<'DATETIME'>, required: boolean)
    {
        const validation = z.iso.datetime();

        return this.#checkRequired(validation, required);
    }

    #validateUuid(constraints: Constraints<'UUID'>, required: boolean)
    {
        const validation = z.uuid();

        return this.#checkRequired(validation, required);
    }

    #validateEmail(constraints: Constraints<'EMAIL'>, required: boolean)
    {
        const validation = z.email().max(MAX_EMAIL_LENGTH);

        return this.#checkRequired(validation, required);
    }

    #validateArray(constraints: Constraints<'ARRAY'>, required: boolean)
    {
        const itemValidator = this.#getFieldValidator(constraints);

        let validation: z.ZodArray<z.ZodTypeAny> = z.array(itemValidator);

        if (constraints.minLength !== undefined) validation = validation.min(constraints.minLength);
        if (constraints.maxLength !== undefined) validation = validation.max(constraints.maxLength);

        return this.#checkRequired(validation, required);
    }

    #validateUrl(constraints: Constraints<'URL'>, required: boolean)
    {
        let validation = z.url().max(MAX_URL_LENGTH);

        if (constraints.protocols !== undefined)
        {
            const escapedProtocols = constraints.protocols!.map((p: string) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const expression = escapedProtocols.join('|');

            validation = validation.regex(new RegExp(`^(${expression}):.*`));
        }

        return this.#checkRequired(validation, required);
    }

    #validateEnum(constraints: Constraints<'ENUM'>, required: boolean)
    {
        const validation = constraints.values === undefined
            ? z.enum([])
            : z.enum(constraints.values);

        return this.#checkRequired(validation, required);
    }

    #checkRequired(validation: z.ZodTypeAny, required: boolean)
    {
        return required ? validation : validation.optional();
    }

    #getMessages(issues: $ZodIssue[], schema: ValidationSchema)
    {
        const messages = new Map<string, string>();

        for (const issue of issues)
        {
            if (issue.code === 'unrecognized_keys')
            {
                this.#mapUnrecognizedKeys(issue, schema, messages);

                continue;
            }

            if (issue.path.length === 0) continue;

            const field = String(issue.path[0]);
            const message = this.#getMessageByField(field, schema);

            messages.set(field, message);
        }

        return messages;
    }

    #mapUnrecognizedKeys(issue: $ZodIssueUnrecognizedKeys, schema: ValidationSchema, messages: Map<string, string>)
    {
        for (const key of issue.keys)
        {
            const message = this.#getMessageByField(key, schema);

            messages.set(key, message);
        }
    }

    #getMessageByField(path: string, schema: ValidationSchema)
    {
        const field = schema[path] as Validation;

        return field?.message ?? 'Invalid field';
    }
}
