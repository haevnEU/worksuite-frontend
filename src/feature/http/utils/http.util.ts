import type { HttpMethod, HttpMethodDetail } from "../models/http.model";

// ==========================================
// 1. UI Styling Helpers
// ==========================================

export const getMethodBadgeColor = (method: HttpMethod): string => {
  switch (method) {
    case "GET":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "POST":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "PUT":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "PATCH":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "DELETE":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case "HEAD":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "OPTIONS":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    case "TRACE":
      return "bg-teal-500/10 text-teal-400 border-teal-500/30";
    case "CONNECT":
      return "bg-violet-500/10 text-violet-400 border-violet-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

// ==========================================
// 2. HTTP Method Snippet Generators
// ==========================================

export const generateCurlSnippet = (item: HttpMethodDetail): string => {
  let cmd = `curl -X ${item.method} "https://api.worksuite.local${item.sampleEndpoint}" \\\n  -H "Authorization: Bearer <access_token>"`;

  if (item.sampleHeaders) {
    Object.entries(item.sampleHeaders).forEach(([header, value]) => {
      cmd += ` \\\n  -H "${header}: ${value}"`;
    });
  }

  if (item.samplePayload) {
    cmd += ` \\\n  -d '${item.samplePayload.replace(/'/g, "\\'")}'`;
  }

  return cmd;
};

export const generateFetchSnippet = (item: HttpMethodDetail): string => {
  const headers: Record<string, string> = {
    Authorization: "Bearer <access_token>",
    ...(item.sampleHeaders || {}),
  };

  const headersString = Object.entries(headers)
    .map(([k, v]) => `    "${k}": "${v}",`)
    .join("\n");

  let payloadString = "";
  if (item.samplePayload) {
    try {
      // Sicheres Formatieren: Parsen und schön einrücken
      const parsed = JSON.parse(item.samplePayload);
      payloadString = `\n  body: JSON.stringify(${JSON.stringify(parsed, null, 4)}),`;
    } catch {
      // Fallback bei Plain-Text/XML ohne App-Crash
      payloadString = `\n  body: ${JSON.stringify(item.samplePayload)},`;
    }
  }

  return `const response = await fetch("https://api.worksuite.local${item.sampleEndpoint}", {
  method: "${item.method}",
  headers: {
${headersString}
  },${payloadString}
});

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();`;
};

export const generateJavaSnippet = (item: HttpMethodDetail): string => {
  const springAnnotationMap: Record<string, string> = {
    GET: "@GetMapping",
    POST: "@PostMapping",
    PUT: "@PutMapping",
    PATCH: "@PatchMapping",
    DELETE: "@DeleteMapping",
  };

  const annotation =
    springAnnotationMap[item.method] ||
    `@RequestMapping(method = RequestMethod.${item.method})`;

  const requestBodyParam = item.samplePayload
    ? `@Valid @RequestBody final RequestDTO request`
    : "";

  return `${annotation}("${item.sampleEndpoint}")
public ResponseEntity<ResponseDTO> handle${item.method.charAt(0) + item.method.slice(1).toLowerCase()}(${requestBodyParam}) {
    // Business logic...
    return ResponseEntity.ok(response);
}`;
};

// ==========================================
// 3. HTTP Status Exception Snippet Generators
// ==========================================

const SPRING_STATUS_ENUM_MAP: Record<number, string> = {
  400: "HttpStatus.BAD_REQUEST",
  401: "HttpStatus.UNAUTHORIZED",
  403: "HttpStatus.FORBIDDEN",
  404: "HttpStatus.NOT_FOUND",
  409: "HttpStatus.CONFLICT",
  418: "HttpStatus.I_AM_A_TEAPOT",
  429: "HttpStatus.TOO_MANY_REQUESTS",
  500: "HttpStatus.INTERNAL_SERVER_ERROR",
  502: "HttpStatus.BAD_GATEWAY",
  503: "HttpStatus.SERVICE_UNAVAILABLE",
  504: "HttpStatus.GATEWAY_TIMEOUT",
};

export const getSpringExceptionSnippet = (
  code: number,
  phrase: string,
): string => {
  const statusEnum =
    SPRING_STATUS_ENUM_MAP[code] || `HttpStatus.valueOf(${code})`;

  return `throw new ResponseStatusException(
    ${statusEnum}, 
    "${phrase}: Details here"
);`;
};

const RESTEASY_EXCEPTION_MAP: Record<number, string> = {
  400: "BadRequestException",
  401: "NotAuthorizedException",
  403: "ForbiddenException",
  404: "NotFoundException",
  409: "ClientErrorException(Response.Status.CONFLICT)",
  500: "InternalServerErrorException",
  503: "ServiceUnavailableException",
};

export const getResteasyExceptionSnippet = (
  code: number,
  phrase: string,
): string => {
  const directException = RESTEASY_EXCEPTION_MAP[code];
  if (directException) {
    return `throw new ${directException}("${phrase}: Details here");`;
  }

  return `throw new WebApplicationException(
    Response.status(${code})
        .entity("${phrase}")
        .build()
);`;
};
