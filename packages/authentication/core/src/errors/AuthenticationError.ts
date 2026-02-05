
export default class AuthenticationError extends Error
{
    constructor(message?: string)
    {
        super(message);
        this.name = this.constructor.name;

        if (Error.captureStackTrace)
        {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
