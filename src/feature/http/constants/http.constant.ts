import type { HttpMethodDetail, HttpStatusCode } from "../models/http.model";

export const HTTP_METHODS_CATALOG: HttpMethodDetail[] = [
  {
    method: "GET",
    category: "Standard",
    description:
      "Requests a representation of the specified resource. Requests using GET should only retrieve data and have no other effect.",
    useCase:
      "Fetching resources, querying collections, downloading files without side effects.",
    rfc: "RFC 9110, Section 9.3.1",
    isSafe: true,
    isIdempotent: true,
    isCacheable: true,
    sampleEndpoint: "/api/v1/users?page=1&limit=20",
    sampleHeaders: {
      Accept: "application/json",
    },
  },
  {
    method: "POST",
    category: "Modification",
    description:
      "Submits an entity to the specified resource, often causing a change in state or side effects on the server.",
    useCase:
      "Creating resources, submitting forms, processing orders, executing RPC commands.",
    rfc: "RFC 9110, Section 9.3.3",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    sampleEndpoint: "/api/v1/users",
    sampleHeaders: {
      "Content-Type": "application/json",
    },
    samplePayload: JSON.stringify(
      {
        firstName: "Nils",
        lastName: "Milewski",
        role: "DEVELOPER",
      },
      null,
      2,
    ),
  },
  {
    method: "PUT",
    category: "Modification",
    description:
      "Replaces all current representations of the target resource with the uploaded request payload.",
    useCase:
      "Full updates of an existing entity, idempotently overwriting state.",
    rfc: "RFC 9110, Section 9.3.4",
    isSafe: false,
    isIdempotent: true,
    isCacheable: false,
    sampleEndpoint: "/api/v1/users/usr_4829",
    sampleHeaders: {
      "Content-Type": "application/json",
    },
    samplePayload: JSON.stringify(
      {
        firstName: "Nils",
        lastName: "Milewski",
        role: "LEAD_ARCHITECT",
        active: true,
      },
      null,
      2,
    ),
  },
  {
    method: "PATCH",
    category: "Modification",
    description:
      "Applies partial modifications to a resource instead of replacing the entire object.",
    useCase:
      "Updating specific fields (e.g. status flags, email address) without transmitting unchanged fields.",
    rfc: "RFC 5789, Section 2",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    sampleEndpoint: "/api/v1/users/usr_4829",
    sampleHeaders: {
      "Content-Type": "application/merge-patch+json",
    },
    samplePayload: JSON.stringify(
      {
        role: "SENIOR_DEVELOPER",
      },
      null,
      2,
    ),
  },
  {
    method: "DELETE",
    category: "Modification",
    description:
      "Deletes the specified resource identified by the Request-URI.",
    useCase: "Removing entities, revoking sessions, clearing cache records.",
    rfc: "RFC 9110, Section 9.3.5",
    isSafe: false,
    isIdempotent: true,
    isCacheable: false,
    sampleEndpoint: "/api/v1/users/usr_4829",
    sampleHeaders: {
      "If-Match": '"737060cd8c284d8af7ad3082f209582d"',
    },
  },
  {
    method: "HEAD",
    category: "Standard",
    description:
      "Identical to GET, but the server does not return a message-body in the response.",
    useCase:
      "Checking resource existence, inspecting Content-Length or ETag without data transfer.",
    rfc: "RFC 9110, Section 9.3.2",
    isSafe: true,
    isIdempotent: true,
    isCacheable: true,
    sampleEndpoint: "/api/v1/reports/export.pdf",
    sampleHeaders: {
      Accept: "application/pdf",
    },
  },
  {
    method: "OPTIONS",
    category: "Diagnostic",
    description:
      "Describes the communication options and CORS capabilities available for the target resource.",
    useCase:
      "CORS preflight checks, discovering supported HTTP verbs on an endpoint.",
    rfc: "RFC 9110, Section 9.3.7",
    isSafe: true,
    isIdempotent: true,
    isCacheable: false,
    sampleEndpoint: "/api/v1/users",
    sampleHeaders: {
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "authorization,content-type",
      Origin: "https://worksuite.local",
    },
  },
  {
    method: "TRACE",
    category: "Diagnostic",
    description:
      "Performs a message loop-back test along the path to the target resource.",
    useCase:
      "Debugging intermediate proxies, observing request alterations across hops.",
    rfc: "RFC 9110, Section 9.3.8",
    isSafe: true,
    isIdempotent: true,
    isCacheable: false,
    sampleEndpoint: "/api/v1/health",
  },
  {
    method: "CONNECT",
    category: "Tunneling",
    description:
      "Establishes a bidirectional tunnel to the server identified by the target resource (often TLS through HTTP proxy).",
    useCase: "Proxying HTTPS connections across firewalls.",
    rfc: "RFC 9110, Section 9.3.6",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    sampleEndpoint: "api.worksuite.local:443",
    sampleHeaders: {
      Host: "api.worksuite.local:443",
      "Proxy-Connection": "Keep-Alive",
    },
  },
];

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    phrase: "Continue",
    category: "1xx",
    description:
      "Initial part of a request has been received and client should proceed with the remainder of the payload.",
    rfc: "RFC 9110, Section 15.2.1",
    practicalExample:
      "Client sends 'Expect: 100-continue' header before uploading large file buffers.",
    clientBehavior: "Continue transmitting remaining request entity body.",
  },
  {
    code: 101,
    phrase: "Switching Protocols",
    category: "1xx",
    description:
      "Server accepts request to switch application protocol via Upgrade header.",
    rfc: "RFC 9110, Section 15.2.2",
    practicalExample:
      "Upgrading plain HTTP/1.1 connection to persistent duplex WebSocket.",
    clientBehavior: "Switch local socket transport parser immediately.",
  },

  // 2xx Success
  {
    code: 200,
    phrase: "OK",
    category: "2xx",
    description:
      "Standard response for successful HTTP requests containing requested payload representation.",
    rfc: "RFC 9110, Section 15.3.1",
    practicalExample:
      "GET /api/v1/tickets returns payload representation of ticket collection.",
    clientBehavior: "Process payload body according to Content-Type header.",
  },
  {
    code: 201,
    phrase: "Created",
    category: "2xx",
    description:
      "Request has been fulfilled and resulted in one or more new resources being created.",
    rfc: "RFC 9110, Section 15.3.2",
    practicalExample:
      "POST /api/v1/tickets creates new record; Location header points to /tickets/101.",
    clientBehavior:
      "Extract Location header to navigate or bind identifier to state.",
  },
  {
    code: 204,
    phrase: "No Content",
    category: "2xx",
    description:
      "Server has successfully fulfilled request and there is no additional content to send in response payload.",
    rfc: "RFC 9110, Section 15.3.5",
    practicalExample:
      "DELETE /api/v1/tickets/101 finishes deletion without returning JSON body.",
    clientBehavior:
      "Do not parse response body; keep active view intact and update UI state.",
  },

  // 3xx Redirection
  {
    code: 301,
    phrase: "Moved Permanently",
    category: "3xx",
    description: "Target resource has been assigned a new permanent URI.",
    rfc: "RFC 9110, Section 15.4.2",
    practicalExample:
      "http://haevn.de automatically permanently redirects to https://haevn.de.",
    clientBehavior:
      "Update bookmarks, follow Location header automatically with cache update.",
  },
  {
    code: 304,
    phrase: "Not Modified",
    category: "3xx",
    description:
      "Conditional GET or HEAD evaluates to false; cached client representation is still fresh.",
    rfc: "RFC 9110, Section 15.4.5",
    practicalExample:
      "Browser sends 'If-None-Match: \"e81b\"'; server confirms cache freshness with 304.",
    clientBehavior:
      "Reuse local cached payload representation directly without body re-transfer.",
  },

  // 4xx Client Error
  {
    code: 400,
    phrase: "Bad Request",
    category: "4xx",
    description:
      "Server cannot or will not process request due to perceived client error (malformed syntax, invalid framing).",
    rfc: "RFC 9110, Section 15.5.1",
    practicalExample:
      "JSON body contains invalid syntax or missing required bean validation fields.",
    clientBehavior:
      "Display validation error feedback to user; do not retry unaltered request.",
  },
  {
    code: 401,
    phrase: "Unauthorized",
    category: "4xx",
    description:
      "Request lacks valid authentication credentials for target resource.",
    rfc: "RFC 9110, Section 15.5.2",
    practicalExample: "Missing or expired Bearer JWT in Authorization header.",
    clientBehavior:
      "Redirect user to login portal or trigger refresh token exchange workflow.",
  },
  {
    code: 403,
    phrase: "Forbidden",
    category: "4xx",
    description:
      "Server understands request but refuses to authorize it; credentials do not have permissions.",
    rfc: "RFC 9110, Section 15.5.4",
    practicalExample:
      "User authenticated with role 'USER' attempts administrative tenant deletion.",
    clientBehavior: "Display permission denied / 403 Forbidden screen to user.",
  },
  {
    code: 404,
    phrase: "Not Found",
    category: "4xx",
    description:
      "Origin server did not find a current representation for target resource.",
    rfc: "RFC 9110, Section 15.5.5",
    practicalExample:
      "GET /api/v1/notes/00000000-0000-0000-0000-000000000000 (entity deleted/missing).",
    clientBehavior:
      "Render 404 view or inform user that resource was moved or removed.",
  },
  {
    code: 409,
    phrase: "Conflict",
    category: "4xx",
    description:
      "Request could not be processed because of conflict in current state of resource.",
    rfc: "RFC 9110, Section 15.5.10",
    practicalExample:
      "Concurrent optimistic locking collision (@Version) or unique email constraint violation.",
    clientBehavior:
      "Prompt user to reload entity and merge concurrent changes.",
  },
  {
    code: 418,
    phrase: "I'm a teapot",
    category: "4xx",
    description:
      "Hyper Text Coffee Pot Control Protocol refusal to brew coffee with a teapot.",
    rfc: "RFC 2324, Section 2.3.2",
    practicalExample:
      "Server is a teapot and permanently incapable of brewing coffee.",
    clientBehavior: "Brew tea instead.",
  },
  {
    code: 429,
    phrase: "Too Many Requests",
    category: "4xx",
    description:
      "User has sent too many requests in a given amount of time (rate limiting).",
    rfc: "RFC 6585, Section 4",
    practicalExample:
      "IP exceeds 100 requests per minute threshold on public REST API.",
    clientBehavior:
      "Parse 'Retry-After' header and throttle successive requests.",
  },

  // 5xx Server Error
  {
    code: 500,
    phrase: "Internal Server Error",
    category: "5xx",
    description:
      "Server encountered an unexpected condition that prevented it from fulfilling request.",
    rfc: "RFC 9110, Section 15.6.1",
    practicalExample:
      "Uncaught NullPointerException or database pool connection timeout.",
    clientBehavior:
      "Log trace ID to error monitoring; render generic server error boundary.",
  },
  {
    code: 502,
    phrase: "Bad Gateway",
    category: "5xx",
    description:
      "Server acting as gateway/proxy received invalid response from inbound upstream server.",
    rfc: "RFC 9110, Section 15.6.3",
    practicalExample:
      "Nginx reverse proxy unable to connect to upstream Spring Boot Docker container.",
    clientBehavior:
      "Display upstream outage notification; retry with exponential backoff.",
  },
  {
    code: 503,
    phrase: "Service Unavailable",
    category: "5xx",
    description:
      "Server currently unable to handle request due to temporary overload or scheduled maintenance.",
    rfc: "RFC 9110, Section 15.6.4",
    practicalExample:
      "Application restarting or circuit breaker is in OPEN state.",
    clientBehavior: "Check 'Retry-After' response header and back off calls.",
  },
  {
    code: 504,
    phrase: "Gateway Timeout",
    category: "5xx",
    description:
      "Server acting as gateway/proxy did not receive timely response from upstream.",
    rfc: "RFC 9110, Section 15.6.5",
    practicalExample:
      "Slow SQL query causing reverse proxy 60s proxy_read_timeout to expire.",
    clientBehavior:
      "Inform user of timeout; inspect slow queries and network latencies.",
  },
];
