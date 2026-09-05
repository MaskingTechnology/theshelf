
import type { FieldTypes } from './constants.js';

export type ValidationType = keyof typeof FieldTypes;

export type StringConstraints = {
    minLength?: number,
    maxLength?: number;
    pattern?: string;
};

export type NumberConstraints = {
    minValue?: number,
    maxValue?: number;
};

export type BooleanConstraints = {};
export type DateConstraints = {};
export type DateTimeConstraints = {};
export type UUIDConstraints = {};
export type EmailConstraints = {};

export type URLConstraints = {
    protocols?: string[];
};

export type EnumConstraints = {
    values?: string[];
};

export type ValidationProperties = {
    message?: string;
    required?: boolean;
};

export type ArrayConstraints = Partial<ValidationTypes> & {
    minLength?: number;
    maxLength?: number;
};

export type ValidationTypes = {
    STRING: StringConstraints;
    NUMBER: NumberConstraints;
    BOOLEAN: BooleanConstraints;
    DATE: DateConstraints;
    DATETIME: DateTimeConstraints;
    UUID: UUIDConstraints;
    EMAIL: EmailConstraints;
    ARRAY: ArrayConstraints;
    URL: URLConstraints;
    ENUM: EnumConstraints;
};

export type Validation = ValidationProperties & Partial<ValidationTypes>;

export type ValidationSchema = Record<string, Validation>;
