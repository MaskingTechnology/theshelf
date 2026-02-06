
# Authentication OpenID driver | The Shelf

This package contains the driver implementation for OpenID. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/authentication @theshelf/authentication-driver-openid
```

## How to use

The basic set up looks like this.

```ts
import IdentityProvider  from '@theshelf/authentication';
import { OpenIDDriver } from '@theshelf/authentication-driver-openid';

const driver = new OpenIDDriver({/* Configuration options */});
const identityProvider = new IdentityProvider(driver);

// Perform operations
```

## Configuration options

```ts
type OpenIDConfiguration = {
    issuer: string; // URL to the provider
    clientId: string; // provided by the provider
    clientSecret: string; // provided by the provider
    redirectPath: string; // e.g. "https://application.com/login"
    secretKey: string; // a high entropy string for hmac
    allowInsecureRequests: boolean; // only set to false in development
};
```