
# HTTP | The Shelf

The HTTP package provides a universal interaction layer with an HTTP client inplementation and adds additional caching.

## Installation

```bash
npm install @theshelf/http
```

## Drivers

Currently, there is only one driver available:

* **Fetch** - Node.js fetch implementation.

## How to use

The instance of the HTTP needs to be imported and one of the drivers must be set.

```ts
import http, { FetchDriver as SelectedDriver } from '@theshelf/http';

// Set the driver before performing any operation (the Fetch driver is used by default)
fileStore.driver = new SelectedDriver(/* configuration */);

// Perform operations with the http instance
```

### Configuration

The HTTP instance does not have any configuration options.

#### Fetch driver

No configuration options.

### Operations driver

```ts
import http, { HTTP_METHODS } from '@theshelf/http';

// Set a cached response
const response: Response = new Response();
http.setCache(HTTP_METHODS.GET, url, response);

// Get a cached response
const response: Response | undefined = http.getCache(HTTP_METHODS.GET, url);

// Remove a cached response
http.removeCache(method: string, url: string)

// Clear all cache
http.clearCache()

// Perform a GET request
const response: Response = await http.get(url);

// Perform a GET request with optional headers
const headers: Record<string, string> = { 'Accept': 'application/json' };
const response: Response = await http.get(url, headers);

// Perform a POST request with optional headers
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
const response: Response = await http.post(url, data, headers);

// Perform a PUT request with optional headers
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
const response: Response = await http.put(url, data, headers);

// Perform a PATCH request with optional headers
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
const response: Response = await http.patch(url, data, headers);

// Perform a DELETE request with optional headers
const headers: Record<string, string> = { };
const response: Response = await http.delete(url, headers);

// Perform a HEAD request with optional headers
const headers: Record<string, string> = { };
const response: Response = await http.head(url, headers);
```

### Response model

The result of every request is a standard [ECMAScript Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

### Caching mechanism

All requests are cached by URL. To prevent this behavior, the cache for the URL must be deleted before performing the request.
