import React, { useState, useMemo } from "react";

type HttpMethod =
  "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
type OutputTab = "fetch" | "curl";

interface HeaderItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export const ApiRequestBuilder: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>("POST");
  const [url, setUrl] = useState<string>("https://api.example.com/v1/resource");
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
    {
      id: "2",
      key: "Authorization",
      value: "Bearer YOUR_TOKEN",
      enabled: true,
    },
  ]);
  const [body, setBody] = useState<string>(
    '{\n  "name": "Sample Item",\n  "status": "ACTIVE"\n}',
  );
  const [activeTab, setActiveTab] = useState<OutputTab>("curl");
  const [copied, setCopied] = useState<boolean>(false);

  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: crypto.randomUUID(), key: "", value: "", enabled: true },
    ]);
  };

  const updateHeader = (
    id: string,
    field: "key" | "value" | "enabled",
    val: any,
  ) => {
    setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const activeHeadersObject = useMemo(() => {
    return headers
      .filter((h) => h.enabled && h.key.trim() !== "")
      .reduce(
        (acc, curr) => {
          acc[curr.key.trim()] = curr.value;
          return acc;
        },
        {} as Record<string, string>,
      );
  }, [headers]);

  const curlCode = useMemo(() => {
    const parts: string[] = [
      `curl -X ${method} '${url || "https://example.com"}'`,
    ];

    Object.entries(activeHeadersObject).forEach(([k, v]) => {
      parts.push(`-H '${k}: ${v}'`);
    });

    if (!["GET", "HEAD"].includes(method) && body.trim()) {
      try {
        const minified = JSON.stringify(JSON.parse(body));
        parts.push(`--data-raw '${minified}'`);
      } catch {
        parts.push(`--data-raw '${body.replace(/'/g, "\\'")}'`);
      }
    }

    return parts.join(" \\\n  ");
  }, [method, url, activeHeadersObject, body]);

  const fetchCode = useMemo(() => {
    const hasHeaders = Object.keys(activeHeadersObject).length > 0;
    const hasBody = !["GET", "HEAD"].includes(method) && body.trim().length > 0;

    let bodyStr = "";
    if (hasBody) {
      try {
        const parsed = JSON.parse(body);
        bodyStr = `  body: JSON.stringify(${JSON.stringify(parsed, null, 4).replace(/\n/g, "\n  ")}),\n`;
      } catch {
        bodyStr = `  body: ${JSON.stringify(body)},\n`;
      }
    }

    const headersStr = hasHeaders
      ? `  headers: ${JSON.stringify(activeHeadersObject, null, 4).replace(/\n/g, "\n  ")},\n`
      : "";

    return (
      `fetch('${url || "https://example.com"}', {\n` +
      `  method: '${method}',\n` +
      headersStr +
      bodyStr +
      `})\n` +
      `.then(res => res.json())\n` +
      `.then(data => console.log(data))\n` +
      `.catch(err => console.error(err));`
    );
  }, [method, url, activeHeadersObject, body]);

  const currentOutput = activeTab === "curl" ? curlCode : fetchCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (m: HttpMethod) => {
    switch (m) {
      case "GET":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "POST":
        return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      case "PUT":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "PATCH":
        return "text-purple-400 border-purple-500/30 bg-purple-500/10";
      case "DELETE":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-slate-400 border-slate-700 bg-slate-800";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-[#0c1322] p-5 shadow-2xl text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono text-base font-bold">
            API
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                HTTP Request Builder
              </h2>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400 border border-blue-500/20">
                Generator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Erzeuge cURL-Befehle und Fetch-Snippets aus Eingabewerten
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Endpoint URL & Method
            </label>
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none transition ${getMethodColor(
                  method,
                )}`}
              >
                <option value="GET" className="bg-slate-900 text-emerald-400">
                  GET
                </option>
                <option value="POST" className="bg-slate-900 text-blue-400">
                  POST
                </option>
                <option value="PUT" className="bg-slate-900 text-amber-400">
                  PUT
                </option>
                <option value="PATCH" className="bg-slate-900 text-purple-400">
                  PATCH
                </option>
                <option value="DELETE" className="bg-slate-900 text-rose-400">
                  DELETE
                </option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/v1/..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 font-mono text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Headers ({Object.keys(activeHeadersObject).length})
              </span>
              <button
                type="button"
                onClick={addHeader}
                className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400 hover:bg-blue-500/20"
              >
                + Add Header
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {headers.map((h) => (
                <div key={h.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) =>
                      updateHeader(h.id, "enabled", e.target.checked)
                    }
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 accent-blue-600"
                  />
                  <input
                    type="text"
                    value={h.key}
                    onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                    placeholder="Key (e.g. Authorization)"
                    className="w-1/2 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-200 outline-none focus:border-slate-700"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) =>
                      updateHeader(h.id, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="w-1/2 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-200 outline-none focus:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(h.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Request Body{" "}
                {["GET", "HEAD"].includes(method) && (
                  <span className="text-slate-500 font-normal">
                    (Ignored for {method})
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => {
                  try {
                    setBody(JSON.stringify(JSON.parse(body), null, 2));
                  } catch {}
                }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Prettify JSON
              </button>
            </div>
            <textarea
              rows={6}
              disabled={["GET", "HEAD"].includes(method)}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Raw payload (JSON / Text)..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 outline-none disabled:opacity-30 disabled:cursor-not-allowed focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("curl")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === "curl"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                cURL
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fetch")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === "fetch"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Fetch (JS)
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {copied ? "✓ Copied!" : "📋 Copy Command"}
            </button>
          </div>

          <div className="relative flex-1 min-h-[300px] w-full rounded-xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs overflow-auto">
            <pre className="text-emerald-400 whitespace-pre-wrap select-all">
              {currentOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
