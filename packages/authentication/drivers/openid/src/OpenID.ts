
import crypto from 'node:crypto';

import type { Configuration, DiscoveryRequestOptions, IDToken, TokenEndpointResponse, TokenEndpointResponseHelpers } from 'openid-client';
import { allowInsecureRequests, authorizationCodeGrant, buildAuthorizationUrlWithPAR, calculatePKCECodeChallenge, discovery, fetchUserInfo, randomNonce, randomPKCECodeVerifier, refreshTokenGrant, tokenRevocation } from 'openid-client';

import type { Driver, Identity, Session } from '@theshelf/authentication';
import { LoginFailed, NotConnected, RefreshFailed, generateId } from '@theshelf/authentication';

import SecretManager from './SecretManager.js';

type OpenIDConfiguration = {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectPath: string;
    signingSecret: string;
    ttl?: number;
    allowInsecureRequests: boolean;
};

const HMAC_ALGORITHM = 'sha512';
const URL_ENCODING = 'base64url';

export default class OpenID implements Driver
{
    readonly #configuration: OpenIDConfiguration;
    readonly #secretManager: SecretManager;
    
    #clientConfiguration?: Configuration;

    constructor(configuration: OpenIDConfiguration)
    {
        this.#configuration = configuration;

        this.#secretManager = new SecretManager(configuration.ttl);
    }

    get name(): string { return OpenID.name; }

    get connected(): boolean
    {
        return this.#clientConfiguration !== undefined;
    }

    async connect(): Promise<void>
    {
        const issuer = new URL(this.#configuration.issuer);
        const clientId = this.#configuration.clientId;
        const clientSecret = this.#configuration.clientSecret;
        const requestOptions = this.#getRequestOptions();

        this.#clientConfiguration = await discovery(issuer, clientId, clientSecret, undefined, requestOptions);

        this.#secretManager.start();
    }

    async disconnect(): Promise<void>
    {
        this.#secretManager.stop();

        this.#clientConfiguration = undefined;
    }

    async getLoginUrl(origin: string): Promise<string>
    {
        const redirect_uri = new URL(this.#configuration.redirectPath, origin).href;
        const scope = 'openid profile email';

        const nonce = randomNonce();
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
            state,
            nonce
        };

        const clientConfiguration = this.#getClientConfiguration();
        const redirectTo = await buildAuthorizationUrlWithPAR(clientConfiguration, parameters);
        const secret = { codeVerifier, nonce };
        
        this.#secretManager.set(state, secret);

        return redirectTo.href;
    }

    async login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        const clientConfiguration = this.#getClientConfiguration();
        const url = new URL(this.#configuration.redirectPath, origin);

        for (const [key, value] of Object.entries(data))
        {
            url.searchParams.set(key, String(value));
        }

        const state = this.#getState(data);
        const secret = this.#secretManager.get(state);

        if (secret === undefined)
        {
            throw new LoginFailed('Missing secret');
        }

        const tokens = await authorizationCodeGrant(clientConfiguration, url, {
            pkceCodeVerifier: secret.codeVerifier,
            expectedNonce: secret.nonce,
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

    async logout(session: Session): Promise<void>
    {
        const config = this.#getClientConfiguration();

        const revocations: Promise<void>[] = [tokenRevocation(config, session.accessToken)];

        if (session.refreshToken !== undefined)
        {
            revocations.push(tokenRevocation(config, session.refreshToken));
        }

        await Promise.allSettled(revocations);
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

        if (this.#configuration.allowInsecureRequests)
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

    #createPayload(): string
    {
        return crypto.randomBytes(64).toString('base64');
    }

    #calculateState(data: string): string
    {
        const value = Buffer.from(data).toString(URL_ENCODING);
        const signature = crypto.createHmac(HMAC_ALGORITHM, this.#configuration.signingSecret).update(data).digest(URL_ENCODING);

        return `${value}.${signature}`;
    }

    #getState(data: Record<string, unknown>): string
    {
        const state = data.state;

        if (typeof state !== 'string')
        {
            throw new LoginFailed('Invalid state');
        }

        const parts = state.split('.');
      
        if (parts.length !== 2)
        {
            throw new LoginFailed('Invalid state');
        }

        const [value, signature] = parts;

        const decodedValue = Buffer.from(value, URL_ENCODING).toString('utf8');
        const decodedSignature = Buffer.from(signature, URL_ENCODING);

        const check = Buffer.from(crypto.createHmac(HMAC_ALGORITHM, this.#configuration.signingSecret).update(decodedValue).digest());

        if (check.length !== decodedSignature.length || crypto.timingSafeEqual(check, decodedSignature) === false)
        {
            throw new LoginFailed('Invalid state');
        }

        return state;
    }
}
