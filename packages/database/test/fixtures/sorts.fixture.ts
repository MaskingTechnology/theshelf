
import type { RecordSort} from '../../src';
import { SortDirections } from '../../src';

export const SORTS: Record<string, RecordSort> =
{
    ASCENDING: { 'name': SortDirections.ASCENDING },
    DESCENDING: { 'size': SortDirections.DESCENDING },
    MULTIPLE_SAME: { 'size': SortDirections.DESCENDING, 'name': SortDirections.DESCENDING },
    MULTIPLE_DIFFERENT: { 'size': SortDirections.DESCENDING, 'name': SortDirections.ASCENDING }
};
