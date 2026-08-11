export class HttpError extends Error {
  public status: number;
  public statusText: string;
  public correlationId?: string;
  public responseBody: string;
  public isHtml: boolean;

  constructor(
    status: number,
    statusText: string,
    responseBody: string,
    headers: Headers,
  ) {
    const correlationId =
      headers.get("x-correlation-id") ||
      headers.get("x-request-id") ||
      undefined;

    const isHtml =
      headers.get("content-type")?.includes("text/html") ||
      responseBody.trim().startsWith("<!DOCTYPE") ||
      responseBody.trim().startsWith("<html");

    super(`HTTP Error ${status}: ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.correlationId = correlationId;
    this.responseBody = responseBody;
    this.isHtml = isHtml;
  }
}
