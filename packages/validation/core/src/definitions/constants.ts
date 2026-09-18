
const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'date',
    DATE_STRING: 'dateString',
    DATETIME_STRING: 'datetimeString',
    TIME_STRING: 'timeString',
    UUID: 'uuid',
    EMAIL: 'email',
    ARRAY: 'array',
    URL: 'url',
    ENUM: 'enum'
} as const;

const MAX_EMAIL_LENGTH = 320;
const MAX_URL_LENGTH = 2083;

export { FieldTypes, MAX_EMAIL_LENGTH, MAX_URL_LENGTH };
