import type {
  AvailableModel,
  LocalAiConfig,
  PromptOptions,
} from "../models/ai.model";

export const testAiConnection = async (
  config: LocalAiConfig,
): Promise<boolean> => {
  try {
    const url =
      config.provider === "ollama"
        ? `${config.baseUrl.replace(/\/$/, "")}/api/tags`
        : `${config.baseUrl.replace(/\/$/, "")}/v1/models`;

    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchInstalledModels = async (
  config: LocalAiConfig,
): Promise<AvailableModel[]> => {
  try {
    const cleanUrl = config.baseUrl.replace(/\/$/, "");
    if (config.provider === "ollama") {
      const res = await fetch(`${cleanUrl}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map(
        (m: { name: string; size?: number; modified_at?: string }) => ({
          name: m.name,
          size: m.size,
          modifiedAt: m.modified_at,
        }),
      );
    }

    const res = await fetch(`${cleanUrl}/v1/models`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((m: { id: string }) => ({ name: m.id }));
  } catch {
    return [];
  }
};

export const executePromptStream = async (
  prompt: string,
  config: LocalAiConfig,
  options?: PromptOptions,
): Promise<string> => {
  const cleanUrl = config.baseUrl.replace(/\/$/, "");
  const system = options?.systemPrompt ?? config.systemPrompt;
  const temp = options?.temperature ?? config.temperature;

  if (config.provider === "ollama") {
    const response = await fetch(`${cleanUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: options?.signal,
      body: JSON.stringify({
        model: config.model,
        prompt,
        system,
        options: { temperature: temp },
        stream: Boolean(options?.onChunk),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama Inferenz fehlgeschlagen: ${response.status} ${response.statusText}`,
      );
    }

    if (!options?.onChunk || !response.body) {
      const data = await response.json();
      return data.response;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split("\n").filter((l) => l.trim() !== "");

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullText += parsed.response;
            options.onChunk(parsed.response);
          }
        } catch {}
      }
    }
    return fullText;
  }

  const response = await fetch(`${cleanUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options?.signal,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: temp,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI-kompatible Inferenz fehlgeschlagen: ${response.statusText}`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  if (options?.onChunk) options.onChunk(text);
  return text;
};
