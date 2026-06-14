import type { CoordToNode, NodeToCoord } from "./protocol";
import { ollamaChat, ollamaReady } from "./ollama";

const COORD = process.env.COORD_URL ?? "wss://nyxos-coordinator-production.up.railway.app/node";
const NODE_KEY = process.env.NODE_KEY ?? "";
const MODEL = process.env.MODEL ?? "llama3.2:1b";
const OLLAMA = process.env.OLLAMA_HOST ?? "http://localhost:11434";

if (!NODE_KEY) {
  console.error("NODE_KEY env var is required.");
  console.error("Register as a provider at https://nyxos.dev/app#providers to get one.");
  process.exit(1);
}

function send(ws: WebSocket, msg: NodeToCoord) {
  ws.send(JSON.stringify(msg));
}

function connect() {
  const ws = new WebSocket(COORD);

  ws.onopen = () => {
    console.log(`→ connected to ${COORD}, registering model ${MODEL}`);
    send(ws, { t: "register", nodeKey: NODE_KEY, model: MODEL });
  };

  ws.onmessage = async (ev) => {
    let msg: CoordToNode;
    try {
      msg = JSON.parse(String(ev.data));
    } catch {
      return;
    }
    if (msg.t === "registered") {
      if (msg.ok) {
        console.log("✓ registered - node is live and earning $NYXOS for completed jobs");
      } else {
        console.error("✗ registration rejected (bad node key). Exiting.");
        ws.close();
      }
    } else if (msg.t === "job") {
      const short = msg.jobId.slice(0, 8);
      console.log(`• job ${short} received`);
      try {
        const content = await ollamaChat(MODEL, msg.messages, OLLAMA);
        send(ws, { t: "result", jobId: msg.jobId, content });
        console.log(`  job ${short} done (${content.length} chars)`);
      } catch (e: any) {
        send(ws, { t: "error", jobId: msg.jobId, message: e?.message ?? "inference failed" });
        console.error(`  job ${short} failed: ${e?.message}`);
      }
    }
  };

  ws.onclose = () => {
    console.log("… disconnected, reconnecting in 3s");
    setTimeout(connect, 3000);
  };
  ws.onerror = () => {
    /* surfaced via onclose */
  };
}

const ready = await ollamaReady(OLLAMA);
if (!ready) {
  console.error(`Ollama not reachable at ${OLLAMA}. Install from https://ollama.com and run: ollama serve`);
  process.exit(1);
}
connect();
