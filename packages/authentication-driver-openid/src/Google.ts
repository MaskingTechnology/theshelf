
import
{
    authorizationCodeGrant, buildAuthorizationUrl,
    calculatePKCECodeChallenge, discovery,
    fetchUserInfo,
    randomNonce, randomPKCECodeVerifier, refreshTokenGrant, tokenRevocation
} from 'openid-client';

import crypto from 'node:crypto';

import type { Configuration, IDToken, TokenEndpointResponse, TokenEndpointResponseHelpers } from 'openid-client';

import { LoginFailed, RefreshFailed, NotConnected, generateId } from '@theshelf/authentication';
import type { Driver, Identity, Session } from '@theshelf/authentication';

type GoogleConfiguration = {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectPath: string;
    accessType: string;
    organizationDomain: string;
};

type Payload = {
    jti: string;
    nonce: string;
    iat: number;
    exp: number;
};

const SECRET = crypto.randomUUID() + crypto.randomUUID();
const TTL = 30000;

export default class Google implements Driver
{
    readonly #providerConfiguration: GoogleConfiguration;
    #clientConfiguration?: Configuration;

    readonly #codeVerifier = randomPKCECodeVerifier();

    constructor(configuration: GoogleConfiguration)
    {
        this.#providerConfiguration = configuration;
    }

    get name(): string { return Google.name; }

    get connected(): boolean
    {
        return this.#clientConfiguration !== undefined;
    }

    async connect(): Promise<void>
    {
        const issuer = new URL(this.#providerConfiguration.issuer);
        const clientId = this.#providerConfiguration.clientId;
        const clientSecret = this.#providerConfiguration.clientSecret;

        this.#clientConfiguration = await discovery(issuer, clientId, clientSecret);
    }

    async disconnect(): Promise<void>
    {
        this.#clientConfiguration = undefined;
    }

    async getLoginUrl(origin: string): Promise<string>
    {
        const redirect_uri = new URL(this.#providerConfiguration.redirectPath, origin).href;
        const scope = 'openid profile email';

        const code_challenge = await calculatePKCECodeChallenge(this.#codeVerifier);
        const code_challenge_method = 'S256';

        const access_type = this.#providerConfiguration.accessType;
        const hd = this.#providerConfiguration.organizationDomain;

        const payload = this.#createPayload();
        const state = this.#calculateSignature(payload);

        const parameters: Record<string, string> = {
            redirect_uri,
            scope,
            code_challenge,
            code_challenge_method,
            access_type,
            hd,
            prompt: 'consent',
            nonce: payload.nonce,
            state
        };

        const clientConfiguration = this.#getClientConfiguration();
        const redirectTo = buildAuthorizationUrl(clientConfiguration, parameters);

        return redirectTo.href;
    }

    async login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        const clientConfiguration = this.#getClientConfiguration();
        const url = new URL(this.#providerConfiguration.redirectPath, origin);

        for (const [key, value] of Object.entries(data))
        {
            url.searchParams.set(key, String(value));
        }

        const payload = this.#getPayload(data.state);

        const tokens = await authorizationCodeGrant(clientConfiguration, url, {
            pkceCodeVerifier: this.#codeVerifier,
            expectedNonce: payload.nonce,
            expectedState: data.state as string,
            idTokenExpected: true
        });

        const access_token = tokens.access_token;
        const claims = this.#getClaims(tokens);

        const sub = claims.sub;
        const expires = claims.exp * 1000;

        const userInfo = await fetchUserInfo(clientConfiguration, access_token, sub);

        const identity: Identity = {
            name: userInfo.name as string,
            nickname: userInfo.nickname,
            picture: userInfo.picture,
            email: userInfo.email as string,
            email_verified: userInfo.email_verified as boolean
        };

        return {
            id: generateId(),
            identity: identity,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expires: new Date(expires)
        };
    }

    async refresh(session: Session): Promise<Session>
    {
        if (session.refreshToken === undefined)
        {
            throw new RefreshFailed('Missing refresh token');
        }
        
        const config = this.#getClientConfiguration();
        const tokens = await refreshTokenGrant(config, session.refreshToken);

        const claims = this.#getClaims(tokens);
        const expires = claims.exp * 1000;

        return {
            id: session.id,
            requester: session.requester,
            identity: session.identity,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expires: new Date(expires)
        };
    }

    logout(session: Session): Promise<void>
    {
        const config = this.#getClientConfiguration();

        return tokenRevocation(config, session.refreshToken ?? session.accessToken);
    }

    #getClientConfiguration(): Configuration
    {
        if (this.#clientConfiguration === undefined)
        {
            throw new NotConnected('Google client not connected');
        }

        return this.#clientConfiguration;
    }

    #getClaims(tokens: TokenEndpointResponse & TokenEndpointResponseHelpers): IDToken
    {
        const claims = tokens.claims();

        if (claims === undefined)
        {
            throw new LoginFailed('No claims in ID token');
        }

        return claims;
    }

    #createPayload(): Payload
    {
        return {
            jti: crypto.randomUUID(),
            nonce: randomNonce(),
            iat: Date.now(),
            exp: Date.now() + TTL
        };
    }

    #calculateSignature(payload: Payload): string
    {
        const data = JSON.stringify(payload);

        const value = Buffer.from(data).toString('base64url');
        const signature = Buffer.from(crypto.createHmac("sha512", SECRET).update(data).digest()).toString('base64url');

        return `${value}.${signature}`;
    }

    #getPayload(state: unknown): Payload
    {
        if (typeof state !== 'string')
        {
            throw new LoginFailed('Invalid state');
        }

        if (state.includes('.') === false)
        {
            throw new LoginFailed('Invalid state');
        }

        const [value, signature] = state.split('.');

        const decodedValue = Buffer.from(value, 'base64').toString('utf8');
        const decodedSignature = Buffer.from(signature, 'base64');

        const check = Buffer.from(crypto.createHmac("sha512", SECRET).update(decodedValue).digest());

        if (crypto.timingSafeEqual(check, decodedSignature) === false)
        {
            throw new LoginFailed('Invalid state');
        }

        const payload = JSON.parse(decodedValue);
        const now = Date.now();

        if (payload.iat > now || payload.exp < now)
        {
            throw new LoginFailed('Invalid state');
        }

        return payload;
    }
}
