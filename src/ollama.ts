import type { ChatMessage } from "./protocol";

const DEFAULT_HOST = "http://localhost:11434";

/** Run a chat completion through a local Ollama instance, return the assistant text. */
export async function ollamaChat(
  model: string,
  messages: ChatMessage[],
  host = DEFAULT_HOST,
): Promise<string> {
  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
  });
  if (!res.ok) throw new Error(`ollama http ${res.status}`);
  const data = (await res.json()) as { message?: { content?: string } };
  return data.message?.content ?? "";
}

/** True if a local Ollama instance is reachable. */
export async function ollamaReady(host = DEFAULT_HOST): Promise<boolean> {
  try {
    const res = await fetch(`${host}/api/version`);
    return res.ok;
  } catch {
    return false;
  }
}
