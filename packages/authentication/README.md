
# Authentication | The Shelf

The authentication packages provide a universal driver system for working with identity provider solutions.

It's based on the following authentication flow:

1. Browser redirects to the IDP login page.
2. User authenticate at the IDP.
3. IDP provides identity information to the driver.
4. The driver starts a session based on the provided identity.
5. Sessions can be refreshed.
6. Until the user logs out.

## Packages

* **[Core](./core/README.md)** - implementation of the authentication flow
* **[OpenID driver](./drivers/openid/README.md)** - universal OpenID driver
