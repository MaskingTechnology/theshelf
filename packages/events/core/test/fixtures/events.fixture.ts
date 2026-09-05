
const TOPICS =
{
    FIRST: 'first',
    SECOND: 'second'
};

const NAMES =
{
    CREATED: 'created',
    UPDATED: 'updated',
    ERRORED: 'errored'
};

export const EVENTS =
{
    FIRST_CREATED: { topic: TOPICS.FIRST, name: NAMES.CREATED, data: undefined },
    FIRST_UPDATED: { topic: TOPICS.FIRST, name: NAMES.UPDATED, data: undefined },
    FIRST_ERRORED: { topic: TOPICS.FIRST, name: NAMES.ERRORED, data: undefined },

    SECOND_CREATED: { topic: TOPICS.SECOND, name: NAMES.CREATED, data: undefined },
    SECOND_UPDATED: { topic: TOPICS.SECOND, name: NAMES.UPDATED, data: undefined }
};
