
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
export type DateStringConstraints = {};
export type DateTimeStringConstraints = {};
export type TimeStringConstraints = {};
export type UUIDConstraints = {};
export type EmailConstraints = {};
export type URLConstraints = {};

export type URLStringConstraints = {
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
    DATE_STRING: DateStringConstraints;
    DATE_TIME_STRING: DateTimeStringConstraints;
    TIME_STRING: TimeStringConstraints;
    UUID: UUIDConstraints;
    EMAIL: EmailConstraints;
    ARRAY: ArrayConstraints;
    URL: URLConstraints;
    URL_STRING: URLStringConstraints;
    ENUM: EnumConstraints;
};

export type Validation = ValidationProperties & Partial<ValidationTypes>;

export type ValidationSchema<T> = Record<keyof T, Validation>;
