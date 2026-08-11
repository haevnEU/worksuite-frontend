import { Protocol } from "../types/network.type.ts";

export const getHost = (): string => {
  return window.location.host;
};

export const getProtocol = (requiredProtocolType: Protocol): string => {
  const isSecure = window.location.protocol === "https:";

  switch (requiredProtocolType) {
    case "http":
      return isSecure ? "https:" : "http:";
    case "ws":
      return isSecure ? "wss:" : "ws:";
    case "ftp":
      return isSecure ? "sftp:" : "ftp:";
    default:
      return isSecure ? "https:" : "http:";
  }
};
