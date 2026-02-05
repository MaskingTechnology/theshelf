
import DatabaseError from './DatabaseError.js';

export default class NotConnected extends DatabaseError
{
    constructor()
    {
        super('Database not connected');
    }
}
