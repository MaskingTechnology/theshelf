
import crypto from 'node:crypto';

export default function generateId(): string
{
    return crypto.randomUUID();
}
