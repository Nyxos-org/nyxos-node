<div align="center">

# ☾ nyxos-node

**The Nyxos node client.** Contribute your GPU to the decentralized inference network and earn **$NYXOS**.

[![license](https://img.shields.io/badge/license-Apache--2.0-7c5cff.svg)](LICENSE)
[![release](https://img.shields.io/github/v/release/Nyxos-org/nyxos-node?color=43e8a0)](https://github.com/Nyxos-org/nyxos-node/releases)
[![website](https://img.shields.io/badge/web-nyxos.dev-7c5cff.svg)](https://nyxos.dev)

</div>

---

## What is this?

[Nyxos](https://nyxos.dev) is a decentralized network for private, open AI. Prompts are routed to independent **provider nodes** - machines like yours running an open model - and settled peer-to-peer in $NYXOS.

This repo is the **node client**: a small, single-binary program that connects your machine to the network, runs inference jobs through [Ollama](https://ollama.com), and earns credits for the work it completes. It's open source so you can verify exactly what runs on your hardware.

## Install & run

```bash
curl -fsSL https://nyxos.dev/join | sh -s <NODE_KEY>
```

That's it - the installer sets up Ollama, pulls the model, downloads the node binary, and starts earning. Get a `NODE_KEY` by registering at [nyxos.dev/app#providers](https://nyxos.dev/app#providers).

<details>
<summary>Manual install</summary>

Download the binary for your platform from [Releases](https://github.com/Nyxos-org/nyxos-node/releases), then:

```bash
chmod +x nyxos-node-*
NODE_KEY=node_… ./nyxos-node-darwin-arm64
```
</details>

## How it works

```
coordinator  ──(WebSocket: job)──▶  your node  ──▶  Ollama  ──▶  model
     ▲                                   │
     └─────────(result + $NYXOS)─────────┘
```

1. The node dials **out** to the coordinator over a secure WebSocket (no open ports, no public IP needed).
2. It registers the model it serves and waits for jobs.
3. For each job it runs a local Ollama completion and returns the result.
4. Completed jobs credit $NYXOS to your linked wallet.

## Requirements

- [Ollama](https://ollama.com) (the installer handles this)
- A machine that can run an open model - the default `llama3.2:1b` runs on most laptops (~1.3 GB, one-time download)

## Configuration

| Env var | Default | Purpose |
|---|---|---|
| `NODE_KEY` | - (required) | Your provider node key |
| `MODEL` | `llama3.2:1b` | Ollama model to serve |
| `COORD_URL` | (Nyxos coordinator) | Coordinator WebSocket endpoint |
| `OLLAMA_HOST` | `http://localhost:11434` | Local Ollama endpoint |

## Build from source

Requires [Bun](https://bun.sh).

```bash
bun install
bun run build        # single binary for your platform
bun run build:all    # all platforms
```

## Security

The node only makes **outbound** connections - it never opens a listening port. It runs jobs through your local Ollama and returns text results; it does not read files or execute arbitrary code. Review [`src/main.ts`](src/main.ts) and [`src/ollama.ts`](src/ollama.ts) - the whole client is a few hundred lines.

## License

[Apache-2.0](LICENSE) © Nyxos
