import type {
  AvailableModel,
  LocalAiConfig,
  PromptOptions,
} from "../models/ai.model";

export const testAiConnection = async (
    config: LocalAiConfig,
): Promise<boolean> => {
  try {
    const cleanUrl = config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${cleanUrl}/v1/models`, { method: "GET" });
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
  const system = options?.systemPrompt?.trim();
  const temp = options?.temperature ?? 0.2;

  const messages = [
    ...(system && system.length > 0
        ? [{ role: "system", content: system }]
        : []),
    { role: "user", content: prompt },
  ];

  const response = await fetch(`${cleanUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options?.signal,
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: temp,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
        `OpenAI-kompatible Inferenz fehlgeschlagen: ${response.status} ${response.statusText}${
            errorBody ? ` - ${errorBody}` : ""
        }`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  if (options?.onChunk) options.onChunk(text);
  return text;
};