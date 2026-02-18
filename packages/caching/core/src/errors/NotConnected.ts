
import CachingError from './CachingError.js';

export default class NotConnected extends CachingError
{
    constructor()
    {
        super('Cache store not connected');
    }
}
