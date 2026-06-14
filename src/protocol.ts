// Wire protocol between a Nyxos node and the coordinator.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Messages a node sends to the coordinator. */
export type NodeToCoord =
  | { t: "register"; nodeKey: string; model: string }
  | { t: "result"; jobId: string; content: string }
  | { t: "error"; jobId: string; message: string };

/** Messages the coordinator sends to a node. */
export type CoordToNode =
  | { t: "registered"; ok: boolean }
  | { t: "job"; jobId: string; messages: ChatMessage[] };
