
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
export type DateObjectConstraints = {};
export type DateConstraints = {};
export type DateTimeConstraints = {};
export type TimeConstraints = {};
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
    DATE_OBJECT: DateObjectConstraints;
    DATE: DateConstraints;
    DATETIME: DateTimeConstraints;
    TIME: TimeConstraints;
    UUID: UUIDConstraints;
    EMAIL: EmailConstraints;
    ARRAY: ArrayConstraints;
    URL: URLConstraints;
    ENUM: EnumConstraints;
};

export type Validation = ValidationProperties & Partial<ValidationTypes>;

export type ValidationSchema<T> = Record<keyof T, Validation>;
