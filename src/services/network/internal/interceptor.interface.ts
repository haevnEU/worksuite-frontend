export interface RequestContext {
  url: string;
  options: RequestInit;
}

export interface ResponseContext<T = unknown> {
  response: Response;
  data?: T;
  request: RequestContext;
}

export interface RequestInterceptor {
  onRequest?: (
    context: RequestContext,
  ) => Promise<RequestContext> | RequestContext;
}

export interface ResponseInterceptor {
  onResponse?: <T>(
    context: ResponseContext<T>,
  ) => Promise<ResponseContext<T>> | ResponseContext<T>;
  onError?: (error: unknown, context: RequestContext) => Promise<never> | never;
}

export type Interceptor = RequestInterceptor & ResponseInterceptor;
