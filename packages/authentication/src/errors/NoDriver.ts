
import AuthenticationError from './AuthenticationError.js';

export default class NoDriver extends AuthenticationError
{
    constructor()
    {
        super('No identity provider driver set');
    }
}
