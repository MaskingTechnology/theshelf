
import EventBrokerError from './EventBrokerError.js';

export default class NotConnected extends EventBrokerError
{
    constructor()
    {
        super('Event broker not connected');
    }
}
