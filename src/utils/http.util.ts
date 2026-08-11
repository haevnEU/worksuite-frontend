export const getResteasyExceptionSnippet = (
  code: number,
  phrase: string,
): string => {
  switch (code) {
    case 400:
      return `throw new BadRequestException("${phrase}");`;
    case 401:
      return `throw new NotAuthorizedException("${phrase}");`;
    case 403:
      return `throw new ForbiddenException("${phrase}");`;
    case 404:
      return `throw new NotFoundException("${phrase}");`;
    case 405:
      return `throw new NotAllowedException("${phrase}");`;
    case 406:
      return `throw new NotAcceptableException("${phrase}");`;
    case 415:
      return `throw new NotSupportedException("${phrase}");`;
    case 500:
      return `throw new InternalServerErrorException("${phrase}");`;
    case 503:
      return `throw new ServiceUnavailableException("${phrase}");`;
    default:
      return `throw new WebApplicationException("${phrase}", Response.Status.fromStatusCode(${code}));`;
  }
};

export const getSpringExceptionSnippet = (
  code: number,
  phrase: string,
): string => {
  const enumNameMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    402: "PAYMENT_REQUIRED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    406: "NOT_ACCEPTABLE",
    408: "REQUEST_TIMEOUT",
    409: "CONFLICT",
    410: "GONE",
    412: "PRECONDITION_FAILED",
    413: "PAYLOAD_TOO_LARGE",
    415: "UNSUPPORTED_MEDIA_TYPE",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    501: "NOT_IMPLEMENTED",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
  };

  const statusEnum = enumNameMap[code];
  if (statusEnum) {
    return `throw new ResponseStatusException(HttpStatus.${statusEnum}, "${phrase}");`;
  }
  return `throw new ResponseStatusException(HttpStatus.valueOf(${code}), "${phrase}");`;
};

export const getMethodBadgeColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "POST":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "PUT":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "PATCH":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "DELETE":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case "OPTIONS":
    case "HEAD":
      return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    default:
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
  }
};
