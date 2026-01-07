
# Authentication | The Shelf

The authentication package provides a universal interaction layer with an actual identity provider solution.

This package is based on the following authentication flow:

1. Browser redirects to the IDP login page.
2. User authenticate at the IDP.
3. IDP provides identity information to this package.
4. This package starts a session based on the provided identity.
5. Sessions can be refreshed via this package.
6. Until the user logs out via this package.

## Installation

```bash
npm install @theshelf/authentication
```

## Drivers

Currently, there are two drivers available:

* **OpenID** - persistent document storage.
* **Google** - authentication via Google accounts

## How to use

The basic set up looks like this.

```ts
import IdentityProvider, { OpenIDDriver | GoogleDriver as SelectedDriver } from '@theshelf/authentication';

const driver = new SelectedDriver(/* configuration */);
const identityProvider = new IdentityProvider(driver);

// Perform operations with the identityProvider instance
```

### Configuration

#### OpenID driver

```ts
type OpenIDConfiguration = {
    issuer: string; // URL to the provider
    clientId: string; // provided by the provider
    clientSecret: string; // provided by the provider
    redirectPath: string; // e.g. "https://application.com/login"
    allowInsecureRequests: boolean; // only set to false in development
};
```

#### Google driver

```ts
type GoogleConfiguration = {
    issuer: string; // "https://accounts.google.com"
    clientId: string; // provided by Google
    clientSecret: string; // provided by Google
    redirectPath: string; // e.g. "https://application.com/login"
    accessType: string; // "online" | "offline"
    organizationDomain: string; // "application.com"
};
```

### Operations

```ts
import { Session } from '@theshelf/authentication';

// Open connection
await identityProvider.connect();

// Close connection
await identityProvider.disconnect();

// Request the URL of the login page
const loginUrl: string = await identityProvider.getLoginUrl();

// Handle a login and get a session
// Throws `LoginFailed` if not successful
const firstSession: Session = await identityProvider.login(providedIdentity);

// Refresh a session
// Throws `LoginFailed` if not successful
const secondSession: Session = await identityProvider.refresh(firstSession);

// Logout
await identityProvider.logout(secondSession);
```

### Session structure

The session has the following structure.

```ts
type Session = {
    key?: string;
    requester?: unknown;
    identity: Identity;
    accessToken: Token;
    refreshToken: Token;
    expires: Date;
};
```

Every session has a unique key that will be provided to external clients. This key is an unrelated hash value that contains no session information. It's ony used for referencing and storage.

The requester represents the actual logged in user retrieved from the identity information (email), and can be stored in the session for quick reference. The full Identity structure looks like this.

```ts
type Identity = {
    name: string;
    nickname: string | undefined;
    picture: string | undefined;
    email: string;
    email_verified: boolean;
};
```

The access and refresh tokens can be of any type, but is always represented as string. This depends on the configured implementation. In most cases this will be a JWT.

```ts
type Token = string;
```
