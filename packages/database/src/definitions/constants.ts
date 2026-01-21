
export const ID = 'id';

export const LogicalOperators =
{
    AND: 'AND',
    OR: 'OR'
} as const;

export const SortDirections =
{
    ASCENDING: 'ASCENDING',
    DESCENDING: 'DESCENDING'
} as const;

export const QueryOperators =
{
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS',
    LESS_THAN: 'LESS_THAN',
    LESS_THAN_OR_EQUALS: 'LESS_THAN_OR_EQUALS',
    GREATER_THAN: 'GREATER_THAN',
    GREATER_THAN_OR_EQUALS: 'GREATER_THAN_OR_EQUALS',
    IN: 'IN',
    NOT_IN: 'NOT_IN',
    CONTAINS: 'CONTAINS', // "%LIKE%"
    STARTS_WITH: 'STARTS_WITH', // "LIKE%"
    ENDS_WITH: 'ENDS_WITH' // "%LIKE"
} as const;
