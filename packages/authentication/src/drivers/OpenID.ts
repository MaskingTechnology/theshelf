
import
{
    allowInsecureRequests, authorizationCodeGrant, buildAuthorizationUrlWithPAR, calculatePKCECodeChallenge, discovery,
    fetchUserInfo, randomNonce, randomPKCECodeVerifier, refreshTokenGrant, tokenRevocation
} from 'openid-client';

import crypto from 'node:crypto';

import type { Configuration, DiscoveryRequestOptions, IDToken, TokenEndpointResponse, TokenEndpointResponseHelpers } from 'openid-client';

import type { Driver } from '../definitions/interfaces.js';
import type { Identity, Session } from '../definitions/types.js';
import LoginFailed from '../errors/LoginFailed.js';
import NotConnected from '../errors/NotConnected.js';
import RefreshFailed from '../errors/RefreshFailed.js';
import CacheManager from '../utils/CacheManager.js';

type OpenIDConfiguration = {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectPath: string;
    secretKey: string;
    allowInsecureRequests: boolean;
};

type Payload = {
    jti: string;
    nonce: string;
    iat: number;
    exp: number;
};

const TTL = 30_000;
const HMAC_ALGORITHM = 'sha512';
const ENCODING = 'base64url';

export default class OpenID implements Driver
{
    readonly #providerConfiguration: OpenIDConfiguration;
    readonly #key: string;
    #clientConfiguration?: Configuration;

    readonly #cacheManager = new CacheManager();

    constructor(configuration: OpenIDConfiguration)
    {
        this.#providerConfiguration = configuration;
        this.#key = configuration.secretKey;
    }

    get connected(): boolean
    {
        return this.#clientConfiguration !== undefined;
    }

    async connect(): Promise<void>
    {
        this.#cacheManager.start();

        const issuer = new URL(this.#providerConfiguration.issuer);
        const clientId = this.#providerConfiguration.clientId;
        const clientSecret = this.#providerConfiguration.clientSecret;
        const requestOptions = this.#getRequestOptions();

        this.#clientConfiguration = await discovery(issuer, clientId, clientSecret, undefined, requestOptions);
    }

    async disconnect(): Promise<void>
    {
        this.#clientConfiguration = undefined;

        this.#cacheManager.stop();
    }

    async getLoginUrl(origin: string): Promise<string>
    {
        const redirect_uri = new URL(this.#providerConfiguration.redirectPath, origin).href;
        const scope = 'openid profile email';

        const codeVerifier = randomPKCECodeVerifier();
        const code_challenge = await calculatePKCECodeChallenge(codeVerifier);
        const code_challenge_method = 'S256';

        const payload = this.#createPayload();
        const state = this.#calculateState(payload);

        const parameters: Record<string, string> = {
            redirect_uri,
            scope,
            code_challenge,
            code_challenge_method,

            state
        };

        const clientConfiguration = this.#getClientConfiguration();
        const redirectTo = await buildAuthorizationUrlWithPAR(clientConfiguration, parameters);

        this.#cacheManager.set(state, codeVerifier);

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

        const state = this.#getState(data);
        const payload = this.#getPayload(state);

        const codeVerifier = this.#cacheManager.get(state);

        const tokens = await authorizationCodeGrant(clientConfiguration, url, {
            pkceCodeVerifier: codeVerifier,
            expectedNonce: payload.nonce,
            expectedState: state,
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
            throw new NotConnected('OpenID client not connected');
        }

        return this.#clientConfiguration;
    }

    #getRequestOptions(): DiscoveryRequestOptions
    {
        const options: DiscoveryRequestOptions = {};

        if (this.#providerConfiguration.allowInsecureRequests)
        {
            options.execute = [allowInsecureRequests];
        }

        return options;
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

    #calculateState(payload: Payload): string
    {
        const data = JSON.stringify(payload);

        const value = Buffer.from(data).toString(ENCODING);
        const signature = crypto.createHmac(HMAC_ALGORITHM, this.#key).update(data).digest(ENCODING);

        return `${value}.${signature}`;
    }

    #getPayload(state: string): Payload
    {
        const [value, signature] = state.split('.');

        const decodedValue = Buffer.from(value, ENCODING).toString('utf8');
        const decodedSignature = Buffer.from(signature, ENCODING);

        const check = Buffer.from(crypto.createHmac(HMAC_ALGORITHM, this.#key).update(decodedValue).digest());

        if (crypto.timingSafeEqual(check, decodedSignature) === false)
        {
            throw new LoginFailed('Invalid state');
        }

        const payload: Payload = JSON.parse(decodedValue);
        const now = Date.now();

        if (payload.iat > now || payload.exp < now)
        {
            throw new LoginFailed('Invalid state');
        }

        return payload;
    }

    #getState(data: Record<string, unknown>): string
    {
        const state = data.state;

        if (typeof state !== 'string')
        {
            throw new LoginFailed('Invalid state');
        }

        if (state.includes('.') === false)
        {
            throw new LoginFailed('Invalid state');
        }

        return state;
    }
}
