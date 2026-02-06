
# HTTP core | The Shelf

This package contains the definition of the http clients.

## Installation

```bash
npm install @theshelf/http
```

## How to use

The basic set up looks like this.

```ts
import Http, { FetchDriver } from '@theshelf/http';

const driver = new FetchDriver();
const http = new Http(driver);

// Perform operations with the http instance
```

## Operations

```ts
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

## Response model

The result of every request is a standard [ECMAScript Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

## Drivers

There are two drivers available.

### Fetch

This driver implements the [Node.js fetch](https://nodejs.org/api/globals.html#fetch) API.

### Mapped

In-memory http client (suited for testing). It doesn't have any configuration options, but has an additional operation.

```ts
// Add a mapping
driver.setMapping(method, url, response);

// Get a mapping 
const response: Response | undefined = driver.getMapping(method, url);

// Remove a mapping
driver.removeMapping(method, url);

// Remove all mappings
driver.clearMappings();
```
