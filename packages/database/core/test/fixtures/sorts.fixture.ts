
import type { RecordSort } from '../../src/index.js';
import { SortDirections } from '../../src/index.js';

export const SORTS: Record<string, RecordSort> =
{
    ASCENDING: { 'name': SortDirections.ASCENDING },
    DESCENDING: { 'size': SortDirections.DESCENDING },
    MULTIPLE_SAME: { 'size': SortDirections.DESCENDING, 'name': SortDirections.DESCENDING },
    MULTIPLE_DIFFERENT: { 'size': SortDirections.DESCENDING, 'name': SortDirections.ASCENDING }
};
