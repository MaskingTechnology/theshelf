
import AuthenticationError from './AuthenticationError.js';

export default class NoProvider extends AuthenticationError
{
    constructor()
    {
        super('No identity provider driver set');
    }
}
