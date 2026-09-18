
const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'date',
    DATE_STRING: 'date_string',
    DATE_TIME_STRING: 'date_time_string',
    TIME_STRING: 'time_string',
    UUID: 'uuid',
    EMAIL: 'email',
    ARRAY: 'array',
    URL: 'url',
    ENUM: 'enum'
} as const;

const MAX_EMAIL_LENGTH = 320;
const MAX_URL_LENGTH = 2083;

export { FieldTypes, MAX_EMAIL_LENGTH, MAX_URL_LENGTH };
