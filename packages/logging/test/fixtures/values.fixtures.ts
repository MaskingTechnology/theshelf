
function dummy() { return; }

const stackError = new Error('Stack');

const messageError = new Error('Message');
messageError.stack = undefined;

export const VALUES =
{
    TEXT: 'text',
    NUMBER: 3.14,
    BOOLEAN: true,
    FUNCTION: dummy,
    NULL: null,
    UNDEFINED: undefined,
    ARRAY: ['text', true, 3.14],
    OBJECT: { a: 'text', b: true, c: 3.14 },
    ERROR_STACK: stackError,
    ERROR_MESSAGE: messageError
};

export const RESULTS =
{
    TEXT: 'text',
    NUMBER: '3.14',
    BOOLEAN: 'true',
    FUNCTION: 'function',
    NULL: 'null',
    UNDEFINED: 'undefined',
    ARRAY: 'text true 3.14',
    OBJECT: JSON.stringify(VALUES.OBJECT),
    ERROR_STACK: stackError.stack,
    ERROR_MESSAGE: messageError.message
};
