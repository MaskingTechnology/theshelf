
const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE_OBJECT: 'date_object',
    DATE: 'date',
    DATETIME: 'datetime',
    TIME: 'time',
    UUID: 'uuid',
    EMAIL: 'email',
    ARRAY: 'array',
    URL: 'url',
    ENUM: 'enum'
} as const;

const MAX_EMAIL_LENGTH = 320;
const MAX_URL_LENGTH = 2083;

export { FieldTypes, MAX_EMAIL_LENGTH, MAX_URL_LENGTH };
