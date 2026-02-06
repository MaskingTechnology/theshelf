
# Authentication core | The Shelf

This package contains the definition of the authentication flow. It uses a interchangeable driver system for performing the actual operations.

## Installation

```bash
npm install @theshelf/authentication
```

## How to use

The basic set up looks like this.

```ts
import IdentityProvider from '@theshelf/authentication';
import driver from '/path/to/driver';

const identityProvider = new IdentityProvider(driver);

// Perform operations
```

## Operations

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

## Session structure

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
