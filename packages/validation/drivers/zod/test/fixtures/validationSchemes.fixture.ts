
import type { ValidationSchema } from '@theshelf/validation';

import { VALUES } from './values.fixture.js';

export const VALIDATION_SCHEMES: Record<string, ValidationSchema> =
{
    STRING: {
        string: {
            message: VALUES.MESSAGES.INVALID_STRING,
            required: true,
            STRING: {
                minLength: 4,
                maxLength: 7,
                pattern: '^[a-zA-Z]+$'
            }
        }
    },

    NUMBER: {
        number: {
            message: VALUES.MESSAGES.INVALID_NUMBER,
            required: true,
            NUMBER: {
                minValue: 10,
                maxValue: 20
            }
        }
    },

    BOOLEAN: {
        boolean: {
            message: VALUES.MESSAGES.INVALID_BOOLEAN,
            required: true,
            BOOLEAN: { }
        }
    },

    DATE: {
        date: {
            message: VALUES.MESSAGES.INVALID_DATE,
            required: true,
            DATE: {}
        }
    },

    DATETIME: {
        datetime: {
            message: VALUES.MESSAGES.INVALID_DATETIME,
            required: true,
            DATETIME: { }
        }
    },

    UUID: {
        id: {
            message: VALUES.MESSAGES.INVALID_ID,
            required: true,
            UUID: { }
        }
    },

    EMAIL: {
        email: {
            message: VALUES.MESSAGES.INVALID_EMAIL,
            required: true,
            EMAIL: { }
        }
    },

    ARRAY: {
        list: {
            message: VALUES.MESSAGES.INVALID_LIST,
            required: true,
            ARRAY: {
                minLength: 1,
                maxLength: 2,
                STRING:
                {
                    minLength: 3,
                    maxLength: 5
                }
            }
        }
    },

    URL_NO_PROTOCOL: {
        url: {
            message: VALUES.MESSAGES.INVALID_URL,
            required: true,
            URL: { }
        }
    },

    URL_HTTPS_FTP: {
        url: {
            message: VALUES.MESSAGES.INVALID_URL,
            required: true,
            URL: {
                protocols: ['https', 'ftp']
            }
        }
    },

    ENUM: {
        enum: {
            message: VALUES.MESSAGES.INVALID_ENUM,
            required: true,
            ENUM: {
                values: ["A", "B", "C"]
            }
        }
    },

    OPTIONAL: {
        string: {
            message: VALUES.MESSAGES.INVALID_STRING,
            required: false,
            STRING: { }
        },
        number: {
            message: VALUES.MESSAGES.INVALID_NUMBER,
            required: false,
            NUMBER: {
                minValue: 18
            }
        }
    },

    MIXED_SCHEMA: {
        id: {
            message: VALUES.MESSAGES.INVALID_ID,
            required: true,
            UUID: { }
        },
        string: {
            message: VALUES.MESSAGES.INVALID_STRING,
            required: true,
            STRING: { }
        },
        number: {
            message: VALUES.MESSAGES.INVALID_NUMBER,
            required: false,
            NUMBER: { }
        },
        email: {
            message: VALUES.MESSAGES.INVALID_EMAIL,
            required: true,
            EMAIL: { }
        },
        date: {
            message: VALUES.MESSAGES.INVALID_DATE,
            required: true,
            DATE: { }
        },
        datetime: {
            message: VALUES.MESSAGES.INVALID_DATETIME,
            required: true,
            DATETIME: { }
        },
        boolean: {
            message: VALUES.MESSAGES.INVALID_BOOLEAN,
            required: true,
            BOOLEAN: { }
        },
        list: {
            message: VALUES.MESSAGES.INVALID_LIST,
            required: false,
            ARRAY: {
                minLength: 1,
                maxLength: 2,
                STRING:
                {
                    minLength: 3,
                    maxLength: 5
                }
            }
        }
    }
};