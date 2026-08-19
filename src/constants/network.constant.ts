import { HttpMethodDetail, HttpStatusCode } from "../models/network.model.ts";

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
  // ==========================================
  // 1xx INFORMATIONAL
  // ==========================================
  {
    code: 100,
    phrase: "Continue",
    category: "1xx",
    description:
      "The initial part of a request has been received and has not yet been rejected by the server.",
    rfc: "RFC 9110, Section 15.2.1",
    practicalExample:
      'Client sends "Expect: 100-continue" before uploading large bodies.',
    clientBehavior: "Continue sending the remainder of the request payload.",
  },
  {
    code: 101,
    phrase: "Switching Protocols",
    category: "1xx",
    description:
      "The server accepts the client's request to switch protocols to the ones listed in the Upgrade header.",
    rfc: "RFC 9110, Section 15.2.2",
    practicalExample: 'WebSocket upgrade handshake via "Upgrade: websocket".',
    clientBehavior: "Switch protocol immediately to the newly agreed protocol.",
  },
  {
    code: 102,
    phrase: "Processing",
    category: "1xx",
    description:
      "WebDAV: The server has received and is processing the request, but no response is available yet.",
    rfc: "RFC 2518",
    practicalExample: "Long-running asynchronous batch operation in WebDAV.",
    clientBehavior:
      "Reset client timeout timer and wait for the final response.",
  },
  {
    code: 103,
    phrase: "Early Hints",
    category: "1xx",
    description:
      "Used to return preliminary response headers before the final HTTP response is ready, allowing asset preloading.",
    rfc: "RFC 8297",
    practicalExample:
      'Sending "Link: </app.css>; rel=preload" while database queries execute.',
    clientBehavior:
      "Preload referenced static assets while waiting for the main response.",
  },

  // ==========================================
  // 2xx SUCCESS
  // ==========================================
  {
    code: 200,
    phrase: "OK",
    category: "2xx",
    description:
      "The request has succeeded. Meaning depends on HTTP method (GET: entity returned, POST: action performed).",
    rfc: "RFC 9110, Section 15.3.1",
    practicalExample: "GET /api/v1/tickets returning a list of tickets.",
    clientBehavior: "Parse and render response body.",
  },
  {
    code: 201,
    phrase: "Created",
    category: "2xx",
    description:
      "The request has been fulfilled and resulted in one or more new resources being created.",
    rfc: "RFC 9110, Section 15.3.2",
    practicalExample:
      "POST /api/v1/notes returning Location header to the newly created note.",
    clientBehavior:
      "Read Location header or newly created entity from response body.",
  },
  {
    code: 202,
    phrase: "Accepted",
    category: "2xx",
    description:
      "The request has been accepted for processing, but the processing has not been completed.",
    rfc: "RFC 9110, Section 15.3.3",
    practicalExample: "POST /api/v1/jobs triggering asynchronous queue task.",
    clientBehavior: "Poll task status endpoint or await WebSocket/push event.",
  },
  {
    code: 203,
    phrase: "Non-Authoritative Information",
    category: "2xx",
    description:
      "The request was successful but the enclosed payload has been modified from that of the origin server by a transforming proxy.",
    rfc: "RFC 9110, Section 15.3.4",
    practicalExample: "Proxy/CDN cache serving modified headers/content.",
    clientBehavior:
      "Process payload; note that meta-information originates from a proxy.",
  },
  {
    code: 204,
    phrase: "No Content",
    category: "2xx",
    description:
      "The server has fulfilled the request and there is no additional content to send in the response payload.",
    rfc: "RFC 9110, Section 15.3.5",
    practicalExample: "DELETE /api/v1/snippets/123 returning empty body.",
    clientBehavior:
      "Keep current view state; treat operation as fully successful.",
  },
  {
    code: 205,
    phrase: "Reset Content",
    category: "2xx",
    description:
      "The server has fulfilled the request and desires that the client resets the document view which caused the request.",
    rfc: "RFC 9110, Section 15.3.6",
    practicalExample:
      "HTML form submission signaling the browser to clear all input fields.",
    clientBehavior: "Clear/reset input forms in the client UI.",
  },
  {
    code: 206,
    phrase: "Partial Content",
    category: "2xx",
    description:
      "The server is successfully fulfilling a Range request for the target resource.",
    rfc: "RFC 9110, Section 15.3.7",
    practicalExample:
      'Video streaming player requesting chunk "Range: bytes=0-1048575".',
    clientBehavior: "Append incoming byte chunk to buffer.",
  },
  {
    code: 207,
    phrase: "Multi-Status",
    category: "2xx",
    description:
      "WebDAV: An XML response body conveying multiple status codes for different resources/operations.",
    rfc: "RFC 4918",
    practicalExample:
      "Batch file move operations with mixed individual results.",
    clientBehavior:
      "Parse XML body and handle status of each item individually.",
  },
  {
    code: 208,
    phrase: "Already Reported",
    category: "2xx",
    description:
      "WebDAV: Used inside a 207 Multi-Status response to avoid enumerating internal members of collection bindings multiple times.",
    rfc: "RFC 5842",
    practicalExample:
      "Collection synchronization avoiding circular tree traversal duplicates.",
    clientBehavior: "Skip reprocessing previously enumerated collection items.",
  },
  {
    code: 226,
    phrase: "IM Used",
    category: "2xx",
    description:
      "The server has fulfilled a GET request and the response is a representation of instance-manipulations applied to current instance.",
    rfc: "RFC 3229",
    practicalExample: "Delta encoding HTTP responses to save bandwidth.",
    clientBehavior: "Apply delta patches to local cache.",
  },

  // ==========================================
  // 3xx REDIRECTION
  // ==========================================
  {
    code: 300,
    phrase: "Multiple Choices",
    category: "3xx",
    description:
      "Target resource has more than one representation, each with its own identifier.",
    rfc: "RFC 9110, Section 15.4.1",
    practicalExample:
      "Content negotiation offering video formats (WebM vs MP4).",
    clientBehavior: "Select preferred representation from returned list.",
  },
  {
    code: 301,
    phrase: "Moved Permanently",
    category: "3xx",
    description: "The target resource has been assigned a new permanent URI.",
    rfc: "RFC 9110, Section 15.4.2",
    practicalExample: "HTTP to HTTPS domain level forwarding.",
    clientBehavior:
      "Cache new target URL permanently and follow Location header.",
  },
  {
    code: 302,
    phrase: "Found",
    category: "3xx",
    description: "Target resource resides temporarily under a different URI.",
    rfc: "RFC 9110, Section 15.4.3",
    practicalExample: "Redirecting an unauthenticated user to /login.",
    clientBehavior: "Follow Location header temporarily with GET.",
  },
  {
    code: 303,
    phrase: "See Other",
    category: "3xx",
    description:
      "The server is redirecting the user agent to a different resource via a GET request (Post/Redirect/Get pattern).",
    rfc: "RFC 9110, Section 15.4.4",
    practicalExample:
      "After successful POST form upload, redirecting to result overview via GET.",
    clientBehavior:
      "Perform GET request against URI specified in Location header.",
  },
  {
    code: 304,
    phrase: "Not Modified",
    category: "3xx",
    description:
      "The resource has not been modified since the version specified by the conditional request headers (If-None-Match, If-Modified-Since).",
    rfc: "RFC 9110, Section 15.4.5",
    practicalExample:
      'Conditional API request with "If-None-Match: W/\\"12345\\"".',
    clientBehavior: "Reuse existing cached copy without downloading body.",
  },
  {
    code: 307,
    phrase: "Temporary Redirect",
    category: "3xx",
    description:
      "Target URI resides temporarily under a different URI. MUST NOT change the original HTTP method (e.g. POST remains POST).",
    rfc: "RFC 9110, Section 15.4.8",
    practicalExample:
      "Load balancer routing active POST requests to a maintenance gateway.",
    clientBehavior: "Resend exact same method and body to new Location.",
  },
  {
    code: 308,
    phrase: "Permanent Redirect",
    category: "3xx",
    description:
      "Target resource has permanently moved. MUST NOT change the original HTTP method when following.",
    rfc: "RFC 9110, Section 15.4.9",
    practicalExample:
      "Permanent REST API migration from /api/v1 to /api/v2 maintaining POST/PUT semantics.",
    clientBehavior:
      "Update bookmarks, resend identical method and payload to new Location.",
  },

  // ==========================================
  // 4xx CLIENT ERROR
  // ==========================================
  {
    code: 400,
    phrase: "Bad Request",
    category: "4xx",
    description:
      "The server cannot or will not process the request due to something perceived to be a client error (e.g., malformed syntax, invalid framing).",
    rfc: "RFC 9110, Section 15.5.1",
    practicalExample:
      "Missing required JSON fields or malformed request syntax.",
    clientBehavior:
      "Display error details; do not retry without modifying request.",
  },
  {
    code: 401,
    phrase: "Unauthorized",
    category: "4xx",
    description:
      "Request has not been applied because it lacks valid authentication credentials for the target resource.",
    rfc: "RFC 9110, Section 15.5.2",
    practicalExample:
      "Missing, invalid, or expired JWT Bearer token in Authorization header.",
    clientBehavior:
      "Trigger Silent Refresh or display Re-Authentication modal.",
  },
  {
    code: 402,
    phrase: "Payment Required",
    category: "4xx",
    description:
      "Reserved for future use. Frequently adopted by digital payment systems and SaaS subscription guards.",
    rfc: "RFC 9110, Section 15.5.3",
    practicalExample:
      "User requests an Enterprise feature without an active paid subscription.",
    clientBehavior: "Prompt user to upgrade license tier or renew plan.",
  },
  {
    code: 403,
    phrase: "Forbidden",
    category: "4xx",
    description:
      "The server understood the request but refuses to authorize it (authenticated, but insufficient permissions / RBAC violation).",
    rfc: "RFC 9110, Section 15.5.4",
    practicalExample:
      "Standard developer role attempting to access admin-restricted tenant settings.",
    clientBehavior: "Show permission denied banner; do not repeat request.",
  },
  {
    code: 404,
    phrase: "Not Found",
    category: "4xx",
    description:
      "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
    rfc: "RFC 9110, Section 15.5.5",
    practicalExample:
      "GET /api/v1/tickets/00000000-0000-0000-0000-000000000000.",
    clientBehavior: "Render 404 Not Found state.",
  },
  {
    code: 405,
    phrase: "Method Not Allowed",
    category: "4xx",
    description:
      "The method received in the request line is known by the origin server but not supported by the target resource.",
    rfc: "RFC 9110, Section 15.5.6",
    practicalExample:
      "Sending a DELETE request to a read-only reporting endpoint.",
    clientBehavior:
      'Inspect "Allow" header for supported methods (e.g. GET, HEAD).',
  },
  {
    code: 406,
    phrase: "Not Acceptable",
    category: "4xx",
    description:
      "Target resource does not have a representation that matches acceptable values specified in Accept headers.",
    rfc: "RFC 9110, Section 15.5.7",
    practicalExample:
      'Request specifies "Accept: application/xml" but server only produces JSON.',
    clientBehavior: "Adjust Accept header criteria to supported MIME types.",
  },
  {
    code: 407,
    phrase: "Proxy Authentication Required",
    category: "4xx",
    description:
      "Client needs to authenticate itself with an intermediate proxy before request can proceed.",
    rfc: "RFC 9110, Section 15.5.8",
    practicalExample:
      "Enterprise forward proxy requiring corporate credentials via Proxy-Authorization.",
    clientBehavior:
      'Provide valid credentials via "Proxy-Authorization" header.',
  },
  {
    code: 408,
    phrase: "Request Timeout",
    category: "4xx",
    description:
      "The server did not receive a complete request message within the time that it was prepared to wait.",
    rfc: "RFC 9110, Section 15.5.9",
    practicalExample:
      "Client connection stalled during large file payload transmission.",
    clientBehavior: "Repeat request on a new connection.",
  },
  {
    code: 409,
    phrase: "Conflict",
    category: "4xx",
    description:
      "Request could not be completed due to a conflict with the current state of the target resource.",
    rfc: "RFC 9110, Section 15.5.10",
    practicalExample:
      "Optimistic locking failure (@Version mismatch) or unique constraint violation.",
    clientBehavior:
      "Reload latest state, prompt user to resolve merge conflicts.",
  },
  {
    code: 410,
    phrase: "Gone",
    category: "4xx",
    description:
      "Target resource is no longer available at the origin server and no forwarding address is known (permanent removal).",
    rfc: "RFC 9110, Section 15.5.11",
    practicalExample:
      "Deprecated REST API endpoint that was permanently decommissioned.",
    clientBehavior: "Remove references/caches to target URI immediately.",
  },
  {
    code: 411,
    phrase: "Length Required",
    category: "4xx",
    description:
      "The server refuses to accept the request without a defined Content-Length.",
    rfc: "RFC 9110, Section 15.5.12",
    practicalExample:
      "POST without Content-Length or chunked transfer encoding.",
    clientBehavior: "Calculate byte size and append Content-Length header.",
  },
  {
    code: 412,
    phrase: "Precondition Failed",
    category: "4xx",
    description:
      "One or more conditions given in the request header fields evaluated to false when tested on the server.",
    rfc: "RFC 9110, Section 15.5.13",
    practicalExample:
      'Conditional PUT with "If-Match: \\"etag123\\"" when etag changed on server.',
    clientBehavior: "Fetch latest ETag and re-evaluate preconditions.",
  },
  {
    code: 413,
    phrase: "Content Too Large",
    category: "4xx",
    description:
      "The server is refusing to process a request because the request payload is larger than the server is willing/able to process.",
    rfc: "RFC 9110, Section 15.5.14",
    practicalExample:
      "Uploading a 50MB CSV when max size is configured to 10MB.",
    clientBehavior: "Compress file or split payload into chunks.",
  },
  {
    code: 414,
    phrase: "URI Too Long",
    category: "4xx",
    description:
      "The server is refusing to service the request because the request-target is longer than the server is willing to interpret.",
    rfc: "RFC 9110, Section 15.5.15",
    practicalExample:
      "GET request with thousands of query parameter IDs exceeding URL limits.",
    clientBehavior: "Refactor query to use POST with request body payload.",
  },
  {
    code: 415,
    phrase: "Unsupported Media Type",
    category: "4xx",
    description:
      "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
    rfc: "RFC 9110, Section 15.5.16",
    practicalExample:
      'Sending "Content-Type: text/plain" to a JSON-only endpoint.',
    clientBehavior: "Send payload formatted as a supported MIME type.",
  },
  {
    code: 416,
    phrase: "Range Not Satisfiable",
    category: "4xx",
    description:
      "None of the ranges in the request's Range header field overlap the current extent of the selected resource.",
    rfc: "RFC 9110, Section 15.5.17",
    practicalExample:
      'Requesting "Range: bytes=5000-6000" on a 1000 byte file.',
    clientBehavior: "Adjust byte range bounds or omit Range header.",
  },
  {
    code: 417,
    phrase: "Expectation Failed",
    category: "4xx",
    description:
      "The expectation given in the request's Expect header field could not be met by at least one of the inbound servers.",
    rfc: "RFC 9110, Section 15.5.18",
    practicalExample:
      'Reverse proxy incapable of handling "Expect: 100-continue".',
    clientBehavior: "Omit Expect header on subsequent retries.",
  },
  {
    code: 418,
    phrase: "I'm a teapot",
    category: "4xx",
    description:
      "HTCPCP/1.0 protocol specification: Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot.",
    rfc: "RFC 2324, Section 2.3.2 / RFC 7168",
    practicalExample:
      "Easter eggs, honeypot traps for automated scrapers, or playful API rejection responses.",
    clientBehavior:
      "Do not attempt coffee extraction; switch beverage request to tea.",
  },
  {
    code: 421,
    phrase: "Misdirected Request",
    category: "4xx",
    description:
      "The request was directed at a server that is not able to produce a response (e.g. connection reuse mismatch).",
    rfc: "RFC 9110, Section 15.5.20",
    practicalExample:
      "HTTP/2 connection coalescing sending SNI host to wrong virtual server.",
    clientBehavior:
      "Open a separate, non-reused TCP/TLS connection for this host.",
  },
  {
    code: 422,
    phrase: "Unprocessable Content",
    category: "4xx",
    description:
      "The server understands the content type and syntax of the request, but was unable to process the contained instructions (semantic errors).",
    rfc: "RFC 9110, Section 15.5.21",
    practicalExample:
      "Spring Boot @Valid bean validation failing with field-level errors.",
    clientBehavior:
      "Highlight validation errors on specific form input fields.",
  },
  {
    code: 423,
    phrase: "Locked",
    category: "4xx",
    description:
      "WebDAV: The source or destination resource of a method is locked against edits.",
    rfc: "RFC 4918",
    practicalExample:
      "Attempting to edit a document that is exclusively checked out by another user.",
    clientBehavior: "Acquire lock or wait until document is unlocked.",
  },
  {
    code: 424,
    phrase: "Failed Dependency",
    category: "4xx",
    description:
      "WebDAV: The method could not be performed because the requested action depended on another action and that action failed.",
    rfc: "RFC 4918",
    practicalExample:
      "Batch transaction step failed, aborting dependent sub-steps.",
    clientBehavior: "Review prior step failures in batch response.",
  },
  {
    code: 425,
    phrase: "Too Early",
    category: "4xx",
    description:
      "The server is unwilling to risk processing a request that might be replayed (TLS 1.3 0-RTT early data anti-replay protection).",
    rfc: "RFC 8470",
    practicalExample:
      "Non-idempotent POST sent over TLS 0-RTT early data handshake.",
    clientBehavior: "Retry request after TLS 1.3 handshake is fully completed.",
  },
  {
    code: 426,
    phrase: "Upgrade Required",
    category: "4xx",
    description:
      "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.",
    rfc: "RFC 9110, Section 15.5.22",
    practicalExample:
      "Server refusing plain HTTP/1.1 and demanding HTTP/2 or TLS upgrade.",
    clientBehavior: "Upgrade protocol as indicated in the Upgrade header.",
  },
  {
    code: 428,
    phrase: "Precondition Required",
    category: "4xx",
    description:
      "The origin server requires the request to be conditional to prevent 'lost update' race conditions.",
    rfc: "RFC 6585, Section 3",
    practicalExample:
      "Requiring If-Match header before allowing PUT updates on resources.",
    clientBehavior:
      "Include conditional header (If-Match / If-Unmodified-Since).",
  },
  {
    code: 429,
    phrase: "Too Many Requests",
    category: "4xx",
    description:
      "The user has sent too many requests in a given amount of time ('rate limiting').",
    rfc: "RFC 6585, Section 4",
    practicalExample:
      "Exceeding rate limit threshold (e.g. 100 requests per minute).",
    clientBehavior: "Read Retry-After header and throttle subsequent requests.",
  },
  {
    code: 431,
    phrase: "Request Header Fields Too Large",
    category: "4xx",
    description:
      "The server is unwilling to process the request because its header fields are too large (either individual header or all combined).",
    rfc: "RFC 6585, Section 5",
    practicalExample:
      "Massive Cookie header or oversized JWT token exceeding proxy limits.",
    clientBehavior: "Clear unused cookies or reduce header sizes.",
  },
  {
    code: 451,
    phrase: "Unavailable For Legal Reasons",
    category: "4xx",
    description:
      "The server is denying access to the resource as a consequence of a legal demand / censorship / GDPR court order.",
    rfc: "RFC 7725",
    practicalExample: "Court-ordered geo-blocking of copyrighted material.",
    clientBehavior:
      "Inform user that resource is legally blocked in their jurisdiction.",
  },

  // ==========================================
  // 5xx SERVER ERROR
  // ==========================================
  {
    code: 500,
    phrase: "Internal Server Error",
    category: "5xx",
    description:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    rfc: "RFC 9110, Section 15.6.1",
    practicalExample:
      "Uncaught NullPointerException or database connectivity crash in Java backend.",
    clientBehavior:
      "Extract X-Correlation-ID from headers, log error, notify user.",
  },
  {
    code: 501,
    phrase: "Not Implemented",
    category: "5xx",
    description:
      "The server does not support the functionality required to fulfill the request (HTTP method not supported anywhere).",
    rfc: "RFC 9110, Section 15.6.2",
    practicalExample:
      "Sending a TRACE or CONNECT method to an API server that does not support it.",
    clientBehavior: "Avoid using this unsupported operation.",
  },
  {
    code: 502,
    phrase: "Bad Gateway",
    category: "5xx",
    description:
      "The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.",
    rfc: "RFC 9110, Section 15.6.3",
    practicalExample:
      "Nginx reverse proxy unable to connect to dead Spring Boot backend container.",
    clientBehavior:
      "Retry with exponential backoff; check backend container health.",
  },
  {
    code: 503,
    phrase: "Service Unavailable",
    category: "5xx",
    description:
      "The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.",
    rfc: "RFC 9110, Section 15.6.4",
    practicalExample:
      "Application restarting or circuit breaker actively tripping open.",
    clientBehavior:
      "Wait for the interval specified in the Retry-After header.",
  },
  {
    code: 504,
    phrase: "Gateway Timeout",
    category: "5xx",
    description:
      "The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.",
    rfc: "RFC 9110, Section 15.6.5",
    practicalExample:
      "Database query taking 60s while Nginx proxy timeout is set to 30s.",
    clientBehavior:
      "Optimize backend queries or increase proxy timeout limits.",
  },
  {
    code: 505,
    phrase: "HTTP Version Not Supported",
    category: "5xx",
    description:
      "The server does not support, or refuses to support, the major version of HTTP that was used in the request message.",
    rfc: "RFC 9110, Section 15.6.6",
    practicalExample:
      "Sending an HTTP/3 request to an old HTTP/1.1-only web server.",
    clientBehavior: "Downgrade HTTP protocol version for connection.",
  },
  {
    code: 506,
    phrase: "Variant Also Negotiates",
    category: "5xx",
    description:
      "The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself.",
    rfc: "RFC 2295",
    practicalExample:
      "Circular content negotiation configuration loop on web server.",
    clientBehavior:
      "Server administrator must fix content negotiation configuration.",
  },
  {
    code: 507,
    phrase: "Insufficient Storage",
    category: "5xx",
    description:
      "WebDAV: The method could not be performed on the resource because the server is unable to store the representation needed to complete the request.",
    rfc: "RFC 4918",
    practicalExample: "Server disk partition 100% full during file upload.",
    clientBehavior: "Free up disk space on server storage.",
  },
  {
    code: 508,
    phrase: "Loop Detected",
    category: "5xx",
    description:
      "WebDAV: The server terminated an operation because it encountered an infinite loop while processing a request with 'Depth: infinity'.",
    rfc: "RFC 5842",
    practicalExample:
      "Circular symbolic links or nested collection loops in WebDAV repository.",
    clientBehavior:
      "Fix recursive circular references in target folder structure.",
  },
  {
    code: 510,
    phrase: "Not Extended",
    category: "5xx",
    description:
      "The policy for accessing the resource has not been met in the request. The server should send back all information necessary to issue an extended request.",
    rfc: "RFC 2774",
    practicalExample: "HTTP Extension Framework policy enforcement.",
    clientBehavior: "Attach required extension headers specified by server.",
  },
  {
    code: 511,
    phrase: "Network Authentication Required",
    category: "5xx",
    description:
      "The client needs to authenticate to gain network access (e.g. Wi-Fi captive portals).",
    rfc: "RFC 6585, Section 6",
    practicalExample:
      "Public airport Wi-Fi intercepting requests before terms acceptance.",
    clientBehavior: "Open captive portal login URL in browser.",
  },
];

export const HTTP_METHODS: HttpMethodDetail[] = [
  // Core REST Methods
  {
    method: "GET",
    category: "CORE",
    description:
      "Requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect.",
    rfc: "RFC 9110, Section 9.3.1",
    isSafe: true,
    isIdempotent: true,
    isCacheable: true,
    requestBodyAllowed: "NO",
    responseBodyAllowed: "YES",
    useCase:
      "Fetching user profiles, querying paginated table records, loading dashboard stats.",
    sampleEndpoint: "/api/v1/users?page=1&limit=20",
    sampleHeaders: {
      Accept: "application/json",
    },
  },
  {
    method: "QUERY",
    category: "CORE",
    description:
      "Safe, idempotent request method that carries a request body to execute complex queries and search filters without hitting URL length limits or abusing POST.",
    rfc: "RFC 9457 / IETF HTTP-QUERY",
    isSafe: true,
    isIdempotent: true,
    isCacheable: true,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Complex filtering, multi-condition database searches, and GraphQL-like querying while maintaining safe GET caching semantics.",
    sampleEndpoint: "/api/v1/tickets/query",
    sampleHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    samplePayload: JSON.stringify(
      {
        filter: {
          status: ["OPEN", "IN_PROGRESS"],
          assignedTo: "nils.milewski",
          tags: { $in: ["backend", "security"] },
          createdAfter: "2026-01-01T00:00:00Z",
        },
        sort: { priority: "DESC", createdAt: "ASC" },
        pagination: { page: 1, pageSize: 50 },
      },
      null,
      2,
    ),
  },
  {
    method: "POST",
    category: "CORE",
    description:
      "Submits an entity to the specified resource, often causing a change in state or side effects on the server (e.g. resource creation or command execution).",
    rfc: "RFC 9110, Section 9.3.3",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Creating a new ticket, submitting authentication credentials, executing payment checkout.",
    sampleEndpoint: "/api/v1/tickets",
    sampleHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    samplePayload: JSON.stringify(
      {
        title: "Fix CSRF Token Validation",
        priority: "HIGH",
        assignedUserId: "123e4567-e89b-12d3-a456-426614174000",
      },
      null,
      2,
    ),
  },
  {
    method: "PUT",
    category: "CORE",
    description:
      "Replaces all current representations of the target resource with the request payload. Complete resource overwrite.",
    rfc: "RFC 9110, Section 9.3.4",
    isSafe: false,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Completely updating a user settings object or uploading/overwriting a file by exact URI.",
    sampleEndpoint: "/api/v1/settings/theme",
    sampleHeaders: {
      "Content-Type": "application/json",
    },
    samplePayload: JSON.stringify(
      {
        accentColor: "indigo",
        enableNotifications: true,
        reducedMotion: false,
      },
      null,
      2,
    ),
  },
  {
    method: "PATCH",
    category: "CORE",
    description:
      "Applies partial modifications to a resource without replacing the entire entity (often via JSON Merge Patch RFC 7396).",
    rfc: "RFC 5789",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Updating only the status of an existing ticket or changing a user email without providing password.",
    sampleEndpoint: "/api/v1/tickets/42",
    sampleHeaders: {
      "Content-Type": "application/merge-patch+json",
    },
    samplePayload: JSON.stringify(
      {
        status: "IN_PROGRESS",
        progressPercentage: 65,
      },
      null,
      2,
    ),
  },
  {
    method: "DELETE",
    category: "CORE",
    description:
      "Deletes the specified resource by its URI. Subsequent calls return 404 or 204.",
    rfc: "RFC 9110, Section 9.3.5",
    isSafe: false,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "OPTIONAL",
    responseBodyAllowed: "YES",
    useCase:
      "Deleting a temporary session, removing a note, tearing down a virtual sandbox environment.",
    sampleEndpoint: "/api/v1/notes/123e4567-e89b-12d3-a456-426614174000",
  },

  // Advanced Standard Verbs
  {
    method: "HEAD",
    category: "ADVANCED",
    description:
      "Identical to GET, but the server MUST NOT return a response body. Used to inspect headers (ETag, Content-Length, Last-Modified) without transferring payload.",
    rfc: "RFC 9110, Section 9.3.2",
    isSafe: true,
    isIdempotent: true,
    isCacheable: true,
    requestBodyAllowed: "NO",
    responseBodyAllowed: "NO",
    useCase:
      "Checking if a large CSV export has been modified on the server before starting download.",
    sampleEndpoint: "/api/v1/exports/monthly-report.csv",
  },
  {
    method: "OPTIONS",
    category: "ADVANCED",
    description:
      "Describes the communication options for the target resource. Crucial for CORS preflight handshakes in browsers.",
    rfc: "RFC 9110, Section 9.3.7",
    isSafe: true,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "OPTIONAL",
    responseBodyAllowed: "YES",
    useCase:
      "Browser preflight check prior to sending cross-origin requests with custom Authorization headers.",
    sampleEndpoint: "/api/v1/user-service/login/id",
    sampleHeaders: {
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers":
        "Authorization, Content-Type, X-Correlation-ID",
      Origin: "http://localhost:5173",
    },
  },
  {
    method: "TRACE",
    category: "ADVANCED",
    description:
      "Performs a message loop-back test along the path to the target resource (debugging proxies and gateways). Commonly disabled for security reasons (XST protection).",
    rfc: "RFC 9110, Section 9.3.8",
    isSafe: true,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "NO",
    responseBodyAllowed: "YES",
    useCase:
      "Diagnosing whether an intermediate corporate proxy modifies incoming HTTP request headers.",
    sampleEndpoint: "/api/v1/diagnostic/echo",
  },
  {
    method: "CONNECT",
    category: "ADVANCED",
    description:
      "Establishes a bidirectional tunnel to the server identified by the target resource (primarily for TLS / HTTPS proxy tunneling).",
    rfc: "RFC 9110, Section 9.3.6",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Configuring an explicit HTTP proxy server to tunnel encrypted SSL traffic over port 443.",
    sampleEndpoint: "identity.haevn.de:443",
  },

  // WebDAV Extensions
  {
    method: "PROPFIND",
    category: "WEBDAV",
    description:
      "WebDAV: Retrieves properties defined on resource, such as author, creation date, modification time, or child directory tree collections.",
    rfc: "RFC 4918, Section 9.1",
    isSafe: true,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase: "Querying WebDAV cloud file hierarchy metadata.",
    sampleEndpoint: "/webdav/documents/",
    sampleHeaders: {
      Depth: "1",
      "Content-Type": "application/xml",
    },
    samplePayload: `<?xml version="1.0" encoding="utf-8" ?>\n<D:propfind xmlns:D="DAV:">\n  <D:allprop/>\n</D:propfind>`,
  },
  {
    method: "LOCK",
    category: "WEBDAV",
    description:
      "WebDAV: Locks a resource to prevent concurrent edits and lost update race conditions.",
    rfc: "RFC 4918, Section 9.10",
    isSafe: false,
    isIdempotent: false,
    isCacheable: false,
    requestBodyAllowed: "YES",
    responseBodyAllowed: "YES",
    useCase:
      "Acquiring exclusive editing rights for a shared document in a collaborative editor.",
    sampleEndpoint: "/webdav/documents/architecture.pdf",
    sampleHeaders: {
      Timeout: "Second-3600",
      "Content-Type": "application/xml",
    },
    samplePayload: `<?xml version="1.0" encoding="utf-8" ?>\n<D:lockinfo xmlns:D="DAV:">\n  <D:lockscope><D:exclusive/></D:lockscope>\n  <D:locktype><D:write/></D:locktype>\n</D:lockinfo>`,
  },
  {
    method: "UNLOCK",
    category: "WEBDAV",
    description:
      "WebDAV: Removes the lock specified by the Lock-Token header from the target resource.",
    rfc: "RFC 4918, Section 9.11",
    isSafe: false,
    isIdempotent: true,
    isCacheable: false,
    requestBodyAllowed: "NO",
    responseBodyAllowed: "NO",
    useCase: "Releasing a document lock after completing file changes.",
    sampleEndpoint: "/webdav/documents/architecture.pdf",
    sampleHeaders: {
      "Lock-Token": "<urn:uuid:e71d4fae-5dec-22d6-fea5-00a0c91e6bf0>",
    },
  },
];
