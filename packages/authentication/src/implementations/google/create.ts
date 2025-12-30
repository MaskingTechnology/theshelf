
import Google from './Google.js';

export default function create(): Google
{
    const issuer = process.env.GOOGLE_ISSUER ?? 'undefined';
    const clientId = process.env.GOOGLE_CLIENT_ID ?? 'undefined';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? 'undefined';
    const redirectPath = process.env.GOOGLE_REDIRECT_PATH ?? 'undefined';
    const accessType = process.env.GOOGLE_ACCESS_TYPE ?? 'online';
    const organizationDomain = process.env.GOOGLE_ORGANIZATION_DOMAIN ?? '';

    return new Google({ issuer, clientId, clientSecret, redirectPath, accessType, organizationDomain });
}
