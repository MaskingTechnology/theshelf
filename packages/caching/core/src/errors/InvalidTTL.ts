
import CachingError from './CachingError.js';

export default class InvalidTTL extends CachingError
{
    constructor()
    {
        super('TTL must be a positive number');
    }
}
