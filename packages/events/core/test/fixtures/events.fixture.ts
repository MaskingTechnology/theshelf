
const CHANNELS =
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
    FIRST_CREATED: { topic: CHANNELS.FIRST, name: NAMES.CREATED },
    FIRST_UPDATED: { topic: CHANNELS.FIRST, name: NAMES.UPDATED },
    FIRST_ERRORED: { topic: CHANNELS.FIRST, name: NAMES.ERRORED },

    SECOND_CREATED: { topic: CHANNELS.SECOND, name: NAMES.CREATED },
    SECOND_UPDATED: { topic: CHANNELS.SECOND, name: NAMES.UPDATED }
};
