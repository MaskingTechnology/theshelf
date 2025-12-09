
import DatabaseError from './DatabaseError.js';

export default class RecordsNotDeleted extends DatabaseError
{
    constructor(message?: string)
    {
        super(message ?? 'Records not deleted');
    }
}
