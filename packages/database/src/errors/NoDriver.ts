
import DatabaseError from './DatabaseError.js';

export default class NoDriver extends DatabaseError
{
    constructor()
    {
        super('No database driver set');
    }
}
