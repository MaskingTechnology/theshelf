
const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'date',
    DATETIME: 'datetime',
    UUID: 'uuid',
    EMAIL: 'email',
    ARRAY: 'array',
    URL: 'url',
    ENUM: 'enum'
};

Object.freeze(FieldTypes);

const MAX_EMAIL_LENGTH = 320;
const MAX_URL_LENGTH = 2083;

export { FieldTypes, MAX_EMAIL_LENGTH, MAX_URL_LENGTH };
