
import
{
    authorizationCodeGrant, buildAuthorizationUrl,
    calculatePKCECodeChallenge, discovery,
    fetchUserInfo,
    randomPKCECodeVerifier, refreshTokenGrant, tokenRevocation
} from 'openid-client';

import type { Configuration, IDToken, TokenEndpointResponse, TokenEndpointResponseHelpers } from 'openid-client';

import type { IdentityProvider } from '../../definitions/interfaces.js';
import type { Identity, Session } from '../../definitions/types.js';
import LoginFailed from '../../errors/LoginFailed.js';
import NotConnected from '../../errors/NotConnected.js';

type GoogleConfiguration = {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectPath: string;
    accessType: string;
    organizationDomain: string;
};

export default class OpenID implements IdentityProvider
{
    readonly #providerConfiguration: GoogleConfiguration;
    #clientConfiguration?: Configuration;

    readonly #codeVerifier = randomPKCECodeVerifier();

    constructor(configuration: GoogleConfiguration)
    {
        this.#providerConfiguration = configuration;
    }

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

        const parameters: Record<string, string> = {
            redirect_uri,
            scope,
            code_challenge,
            code_challenge_method,
            access_type,
            hd,
            prompt: 'consent'
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
            url.searchParams.set(key, value as string);
        }

        const tokens = await authorizationCodeGrant(clientConfiguration, url, {
            pkceCodeVerifier: this.#codeVerifier,
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
            refreshToken: tokens.refresh_token as string,
            expires: new Date(expires)
        };
    }

    async refresh(session: Session): Promise<Session>
    {
        const config = this.#getClientConfiguration();
        const tokens = await refreshTokenGrant(config, session.refreshToken);

        const claims = this.#getClaims(tokens);
        const expires = claims.exp * 1000;

        return {
            requester: session.requester,
            identity: session.identity,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token as string,
            expires: new Date(expires)
        };
    }

    logout(session: Session): Promise<void>
    {
        const config = this.#getClientConfiguration();

        return tokenRevocation(config, session.refreshToken);
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
}
